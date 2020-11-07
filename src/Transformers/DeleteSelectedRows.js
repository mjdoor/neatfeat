const DeleteSelectedRows = (data, selectedColumns) => {
  selectedColumns.forEach((element) => {
    //deletedRows.push(data[element]);
    data.map((key) => delete key[element]);
  });

  return [...data]; // duplicating array here so redux will properly update the state since it will see this as a new variable.
};

export default DeleteSelectedRows;
