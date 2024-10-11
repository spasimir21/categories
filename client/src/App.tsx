import { useEffect, useState } from 'react';

function App() {
  const [categories, setCategories] = useState<{ ID: string; Name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const createCategory = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch('http://localhost:8080/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const json = await res.json();

    setCategories(c => [...c, json]);

    setLoading(false);
    setName('');
  };

  const deleteCategory = async (id: string) => {
    await fetch(`http://localhost:8080/${id}`, { method: 'DELETE' });

    setCategories(c => c.filter(c => c.ID !== id));
  };

  return (
    <>
      <div className='w-screen flex flex-col items-center pt-16 gap-8 rounded-lg'>
        <div className='shadow-lg p-4 flex items-center gap-4'>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='shadow-md border-gray-400 border-2 rounded-lg px-3 py-1'
            type='text'
            placeholder='Name'
          />
          <p onClick={createCategory} className='px-4 py-1 bg-green-500 rounded-lg cursor-pointer text-white font-bold'>
            {loading ? '...' : 'Add a Category'}
          </p>
        </div>
        <div className='shadow-lg py-4 px-8 flex flex-col items-center gap-4 rounded-lg'>
          <p className='font-bold text-lg'>Categories (Second Branch)</p>
          {categories.length > 0 ? (
            categories.map(category => (
              <div
                key={category.ID}
                onClick={() => deleteCategory(category.ID)}
                className='shadow-md py-1 px-4 cursor-pointer rounded-lg border-gray-400 border-2'>
                <p className='font-bold'>{category.Name}</p>
              </div>
            ))
          ) : (
            <p>No catgeories found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
