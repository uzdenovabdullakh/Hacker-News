const useFormateDate = (date) => {
  const milliseconds = date * 1000;
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString();
  return humanDateFormat;
};

export default useFormateDate;
