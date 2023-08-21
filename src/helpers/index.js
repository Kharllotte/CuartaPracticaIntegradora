const helperMain = {
  formatDate(date) {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const ampm = hour > 12 ? "p.m" : "a.m";
    const minutes = newDate.getMinutes();

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();

    return `${year}/${month}/${day} ${hour}:${minutes} ${ampm}`;
  },

  uploadMulter({ storage }) {
    
  },
};

export default helperMain;
