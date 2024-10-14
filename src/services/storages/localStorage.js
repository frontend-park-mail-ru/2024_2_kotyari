
export class LocalStorageManager {
  saveUserData = (data) => {
    localStorage.setItem('name', data.name);
    localStorage.setItem('city', data.city);
  };

  getUserData = () => {
    return {
      name: localStorage.getItem('name') || '',
      city: localStorage.getItem('city') || ''
    };
  };

  clearUserData = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('city');
  };
}