import { useEffect, useState } from 'react';

const useRole = () => {
  const [role, setRole] = useState('');
  const savedRole = localStorage.getItem('role');
  useEffect(() => {
    setRole(savedRole);
  }, [savedRole]);
  return [role, setRole];
};

export default useRole;
