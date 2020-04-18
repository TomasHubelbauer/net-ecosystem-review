import './App.css';
import React, { FC, useEffect, useState, ChangeEventHandler, MouseEventHandler } from 'react';

type Item = {
  id: string;
  name: string;
  link: string;
  stars: number;
};

type Record =
  | { state: 'ready'; fileName: string; }
  | { state: 'loading'; fileName: string; }
  | { state: 'success'; fileName: string; items: Item[]; }
  | { state: 'error'; fileName: string; error: Error; }
  ;

const suffixLength = '.###Z.csv'.length;
const App: FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    void async function () {
      const response = await fetch('data/index.log');
      const text = await response.text();
      const records: Record[] = text
        .split('\n')
        // Remove newline
        .slice(0, -1)
        .map(fileName => ({
          state: 'ready',
          fileName,
        }));

      setRecords(records);
      if (records.length > 0) {
        setSelectedRecordIndex(records.length - 1);
      }
    }()
  }, []);

  useEffect(() => {
    async function loadRecord(recordIndex: number) {
      const record = records[recordIndex];

      // Prevent loading an error which is already loading, loaded or failed
      if (record.state !== 'ready') {
        return;
      }

      // Mark the record as loading
      setRecords(records.map((record, index) => index === recordIndex ? ({ state: 'loading', fileName: record.fileName }) : record));

      let _record: Record;
      try {
        const response = await fetch('data/' + record.fileName);
        const text = await response.text();
        const items: Item[] = text
          .split('\n')
          // Remove headers & newline
          .slice(1, -1)
          .map(item => {
            const [id, name, stars, link] = item.includes(';') ? item.split(';') : item.split(',');
            return { id, name, stars: Number(stars), link }
          });
        _record = {
          state: 'success',
          fileName: record.fileName,
          items,
        };
      } catch (error) {
        _record = {
          state: 'error',
          fileName: record.fileName,
          error
        }
      }

      // Mark the record as either loaded or errored
      setRecords(records.map((record, index) => (index === recordIndex) ? _record : record));
    }

    if (selectedRecordIndex === null) {
      return;
    }

    // Load the selected record
    loadRecord(selectedRecordIndex);

    // Load the prev record for comparison
    if (selectedRecordIndex > 0) {
      loadRecord(selectedRecordIndex - 1);
    }

    // Load the next record for comparison
    if (selectedRecordIndex < records.length - 1) {
      loadRecord(selectedRecordIndex + 1);
    }
    
    // Reset hash after the records have rendered to cause jump to anchor
    const fragment = window.location.hash;
    window.location.hash = fragment;
  }, [selectedRecordIndex, records]);

  const handleRecordSelectChange: ChangeEventHandler<HTMLSelectElement> = event => {
    setSelectedRecordIndex(Number(event.currentTarget.value));
  };

  const [forceUpdateNonce, setForceUpdateNonce] = useState();
  const handleToggleButtonClick: MouseEventHandler<HTMLButtonElement> = event => {
    const { id, name } = event.currentTarget.dataset;
    if (id === undefined || name === undefined) {
      throw new Error('ID and name must be passed!');
    }

    if (localStorage.getItem(id)) {
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, name);
    }

    void forceUpdateNonce;
    setForceUpdateNonce(Date.now);
  };

  const handleFilterInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    setFilter(event.currentTarget.value);
  };

  const handlePrevButtonClick: MouseEventHandler = event => {
    if (selectedRecordIndex === null) {
      return;
    }

    setSelectedRecordIndex(selectedRecordIndex > 0 ? selectedRecordIndex - 1 : records.length - 1);
  };

  const handleNextButtonClick: MouseEventHandler = event => {
    if (selectedRecordIndex === null) {
      return;
    }

    setSelectedRecordIndex(selectedRecordIndex < records.length - 1 ? selectedRecordIndex + 1 : 0);
  };

  function renderRelatedRecord(record: Record, item: Item, flipSign: boolean) {
    if (record.state === 'ready' || record.state === 'loading') {
      return 'Loading…';
    }

    if (record.state === 'error') {
      return 'Error!';
    }

    const index = record.items.findIndex(i => i.id === item.id);
    const comparedItem = record.items[index];
    if (!comparedItem) {
      return 'No match';
    }

    const change = item.stars - comparedItem.stars;
    const difference = Math.abs(change);
    const sign = Math.sign(change) > 0;
    return (
      <>
        <code>{(sign || flipSign) ? '+' : '-'}</code>
        {difference} ({comparedItem.stars})
      </>
    );
  }

  function renderSelectedRecord() {
    if (selectedRecordIndex === null) {
      return 'No record is selected';
    }

    const selectedRecord = records[selectedRecordIndex];
    if (selectedRecord.state === 'ready') {
      return 'Selected ' + selectedRecord.fileName;
    }

    if (selectedRecord.state === 'loading') {
      return 'Loading ' + selectedRecord.fileName + '…';
    }

    if (selectedRecord.state === 'error') {
      return selectedRecord.error.message;
    }

    const prevRecord = selectedRecordIndex > 0 ? records[selectedRecordIndex - 1] : null;
    const nextRecord = selectedRecordIndex < records.length - 1 ? records[selectedRecordIndex + 1] : null;
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Stars</th>
            <th>Gap</th>
            {prevRecord && <th>{prevRecord.fileName.slice(0, -suffixLength)}</th>}
            {nextRecord && <th>{nextRecord.fileName.slice(0, -suffixLength)}</th>}
          </tr>
        </thead>
        <tbody>
          {selectedRecord.items.map((item, index) => item.name.toUpperCase().includes(filter.toUpperCase()) && (
            <tr key={item.id} className={localStorage.getItem(item.id) ? '★' : '☆'}>
              <td>
                <button data-id={item.id} data-name={item.name} onClick={handleToggleButtonClick}>
                  {localStorage.getItem(item.id) ? '★' : '☆'}
                </button>
              </td>
              <td id={String(index + 1)}>
                <a href={'#' + String(index + 1)}>#{index + 1}</a>
              </td>
              <td>{item.id}</td>
              <td id={item.name}>
                <a href={'#' + item.name}>#</a>
                {' '}
                {item.link ? <a href={item.link}>{item.name}</a> : item.name}
              </td>
              <td>{item.stars}</td>
              <td>{renderGap(selectedRecord.items, index)}</td>
              {prevRecord && <td>{renderRelatedRecord(prevRecord, item, true)}</td>}
              {nextRecord && <td>{renderRelatedRecord(nextRecord, item, false)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderGap(items: Item[], index: number) {
    if (index === 0) {
      return null;
    }

    const currentItem = items[index];
    let comparedItem: Item | undefined;
    do {
      index--;
      comparedItem = items[index];
    } while (index > 0 && (comparedItem === undefined || comparedItem.stars === currentItem.stars));

    return comparedItem.stars - currentItem.stars;
  }

  return (
    <div>
      <button onClick={handlePrevButtonClick}>←</button>
      <select onChange={handleRecordSelectChange} value={selectedRecordIndex || undefined}>
        {records.map((record, index) => <option key={record.fileName} value={index}>{record.fileName.slice(0, -suffixLength)}</option>)}
      </select>
      <button onClick={handleNextButtonClick}>→</button>
      <input placeholder="🔍" value={filter} onChange={handleFilterInputChange} />
      Copyright &copy; <a href="https://hubelbauer.net">Tomas Hubelbauer</a> 2019.
      {' '}
      <a href="https://github.com/TomasHubelbauer/net-ecosystem-review">GitHub</a>
      <hr />
      {renderSelectedRecord()}
    </div>
  );
}

export default App;
