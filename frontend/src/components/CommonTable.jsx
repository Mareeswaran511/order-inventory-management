function CommonTable({
  headers = [],
  children,
  emptyMessage = "No records found",
}) {
  return (
    <div className="table-responsive border-top">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-uppercase small">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={header === "Actions" ? "text-center" : ""}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}

export default CommonTable;