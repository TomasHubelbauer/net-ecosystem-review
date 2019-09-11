import './App.css';
import React, { FC, useEffect, useState, ChangeEventHandler } from 'react';

const App: FC = () => {
  const [records, setRecords] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<{ fileName: string; state: 'loading'; } | { fileName: string; state: 'success'; items: { id: string; name: string; stars: string; }[]; } | null>(null);

  useEffect(() => {
    void async function () {
      const response = await fetch('data/index.log');
      const text = await response.text();
      const records = text.split('\n');

      // Remove newline
      records.pop();

      setRecords(records);
      setSelectedRecord({ fileName: records[records.length - 1], state: 'loading' });
    }()
  }, []);

  useEffect(() => {
    if (selectedRecord === null) {
      return;
    }

    if (selectedRecord.state === 'success') {
      return;
    }

    void async function () {
      const response = await fetch('data/' + selectedRecord.fileName);
      const text = await response.text();
      const items = text
        .split('\n')
        // Remove headers & newline
        .slice(1, -1)
        .map(item => {
          const [id, name, stars] = item.split(';');
          return { id, name, stars }
        });

      setSelectedRecord({ fileName: selectedRecord.fileName, state: 'success', items });
    }()
  }, [selectedRecord]);

  const handleRecordSelectChange: ChangeEventHandler<HTMLSelectElement> = event => {
    setSelectedRecord({ fileName: event.currentTarget.value, state: 'loading' })
  };

  return (
    <div>
      <select onChange={handleRecordSelectChange}>
        {records.map(record => <option key={record}>{record}</option>)}
      </select>
      <br />
      {selectedRecord
        ? (selectedRecord.state === 'loading'
          ? 'Loading record…'
          : (
            <table>
              <caption>{selectedRecord.fileName}</caption>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecord.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.stars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )
        : 'No record is selected.'}
    </div>
  );
}

export default App;
