import './App.css';
import React, { FC, useEffect, useState, ChangeEventHandler } from 'react';

type Item = {
  id: string;
  name: string;
  stars: number;
};

type Record =
  | { state: 'ready'; fileName: string; }
  | { state: 'loading'; fileName: string; }
  | { state: 'success'; fileName: string; items: Item[]; }
  | { state: 'error'; fileName: string; error: Error; }
  ;

const App: FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);

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

      const response = await fetch('data/' + record.fileName);
      const text = await response.text();
      const items: Item[] = text
        .split('\n')
        // Remove headers & newline
        .slice(1, -1)
        .map(item => {
          const [id, name, stars] = item.split(';');
          return { id, name, stars: Number(stars) }
        });

      const _records = records.map((record, index) => {
        if (index === recordIndex) {
          return {
            state: 'success' as const,
            fileName: record.fileName,
            items,
          };
        }

        return record;
      });

      setRecords(_records);
    }

    if (selectedRecordIndex === null) {
      return;
    }

    // Load the prev record for comparison
    if (selectedRecordIndex > 0) {
      loadRecord(selectedRecordIndex - 1);
    }

    // Load the selected record
    loadRecord(selectedRecordIndex);

    // Load the next record for comparison
    if (selectedRecordIndex < records.length - 1) {
      loadRecord(selectedRecordIndex + 1);
    }
  }, [selectedRecordIndex, records]);

  const handleRecordSelectChange: ChangeEventHandler<HTMLSelectElement> = event => {
    setSelectedRecordIndex(Number(event.currentTarget.value));
  };

  function renderRelatedRecord(record: Record, item: Item, sign: '+' | '-') {
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

    switch (sign) {
      case '+': {
        if (item.stars >= comparedItem.stars) {
          return `+${item.stars - comparedItem.stars} (from ${comparedItem.stars})`;
        } else {
          return `-${item.stars - comparedItem.stars} (from ${comparedItem.stars})`;
        }
      }
      case '-': {
        if (item.stars >= comparedItem.stars) {
          return `+${comparedItem.stars - item.stars} (from ${comparedItem.stars})`;
        } else {
          return `-${comparedItem.stars - item.stars} (from ${comparedItem.stars})`;
        }
      }
    }
  }

  function renderSelectedRecord() {
    if (!selectedRecordIndex) {
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
        <caption>{selectedRecord.fileName}</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Stars</th>
            <th>Gap</th>
            {prevRecord && <th>Change from<br />{prevRecord.fileName}</th>}
            {nextRecord && <th>Change from<br />{nextRecord.fileName}</th>}
          </tr>
        </thead>
        <tbody>
          {selectedRecord.items.map((item, index) => (
            <tr key={item.id}>
              <td id={String(index + 1)}>
                <a href={'#' + String(index + 1)}>{index + 1}</a>
              </td>
              <td>{item.id}</td>
              <td id={item.name}>
                <a href={'#' + item.name}>{item.name}</a>
              </td>
              <td>{item.stars}</td>
              <td>{renderGap(selectedRecord.items, index)}</td>
              {prevRecord && <td>{renderRelatedRecord(prevRecord, item, '+')}</td>}
              {nextRecord && <td>{renderRelatedRecord(nextRecord, item, '-')}</td>}
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
      <select onChange={handleRecordSelectChange} value={selectedRecordIndex || undefined}>
        {records.map((record, index) => <option key={record.fileName} value={index}>{record.fileName}</option>)}
      </select>
      {renderSelectedRecord()}
    </div>
  );
}

export default App;
