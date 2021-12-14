import { DataGrid } from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";

import useStore from "./store/store";

const colsIntr = Array(3)
  .fill(0)
  .map((_, i) => ({
    field: `${i + 1}`,
    headerName: `${i + 1}`,
    sortable: false,
    disableColumnMenu: true,
    filterable: false,
    hideSortIcons: true,
    editable: true,
    headerAlign: "center",
    headerClassName: "myheaderClass",
    width: 100,
  }));

const colsDistr = [
  {
    field: `col1`,
    headerName: "Coeff.",
    sortable: false,
    disableColumnMenu: true,
    filterable: false,
    hideSortIcons: true,
    editable: false,
    headerAlign: "center",
    headerClassName: "myheaderClass",
    width: 125,
  },
  {
    field: `col2`,
    headerName: "Value",
    sortable: false,
    disableColumnMenu: true,
    filterable: false,
    hideSortIcons: true,
    editable: true,
    headerAlign: "center",
    headerClassName: "myheaderClass",
    width: 160,
  },
];

const distrNames = [
  "k1",
  "k2",
  "p1",
  "p2",
  "k3",
  "k4",
  "k5",
  "k6",
  "s1",
  "s2",
  "s3",
  "s4",
  "τx",
  "τy",
];

const rowHeight = 25;
const headerHeight = 30;

export default function TabCamera() {
  const cameraMatrix = useStore((state) => state.cameraMatrix);
  const setCamMatrix = useStore((state) => state.setCamMatrix);
  const distorCoeff = useStore((state) => state.distorCoeff);
  const setDistorCoeff = useStore((state) => state.setDistorCoeff);

  const rowsIntr = cameraMatrix
    .map((row, idx) => [{ id: idx, 1: row[0], 2: row[1], 3: row[2] }])
    .flat();

  const ditrExpand = distrNames.map((el, idx) =>
    idx >= distorCoeff.length ? 0 : distorCoeff[idx]
  );

  const rowsDistr = distrNames
    .map((el, idx) => [
      { id: idx, col1: el, col2: ditrExpand[idx].toFixed(10) },
    ])
    .flat();

  const updateIntrins = (params, event, details) => {
    event.preventDefault();
    const i = params.id;
    const j = parseInt(params.field) - 1;
    const newValue = parseFloat(params.value);
    const newArr = Object.assign([...cameraMatrix], {
      [i]: Object.assign([...cameraMatrix[i]], {
        [j]: newValue,
      }),
    });
    setCamMatrix(newArr);
  };

  const updateDistr = (params, event, details) => {
    console.log(params, event, details);
    const newdisrtcoeff = Object.assign([], ditrExpand, {
      [params.id]: parseFloat(params.value),
    });
    setDistorCoeff(newdisrtcoeff);
  };
  return (
    <>
      <Divider sx={{ pt: 2, pb: 1 }} textAlign="left">
        Intrinsic Param.
      </Divider>
      <div style={{ width: 302, height: rowHeight * 3.09 + headerHeight }}>
        <DataGrid
          onCellEditCommit={updateIntrins}
          rows={rowsIntr}
          columns={colsIntr}
          hideFooter
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </div>
      <Divider sx={{ pt: 2, pb: 1 }} textAlign="left">
        distorCoeff Coeff.
      </Divider>
      <div style={{ width: 302, height: rowHeight * 12.09 + headerHeight }}>
        <DataGrid
          onCellEditCommit={updateDistr}
          rows={rowsDistr}
          columns={colsDistr}
          hideFooter
          rowHeight={25}
          headerHeight={30}
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </div>
    </>
  );
}
