import { useMemo } from "react";
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import "./List.scss";

type Vehicle = {
  unit: string;
  make: string;
  vin: string;
  plate: string;
  subtype: string;
  year: number;
  country: string;
  gvw: number;
  isActive: boolean;
};

const data: Vehicle[] = [
  {
    unit: 'Ken10',
    make: 'Kenworth',
    vin: '12345678',
    plate: 'ABC123',
    subtype: 'Truck Tractor',
    year: 2010,
    country: 'Canada',
    gvw: 19000,
    isActive: false
  },
  {
    unit: 'Ken10',
    make: 'Kenworth',
    vin: '12345678',
    plate: 'ABC123',
    subtype: 'Truck Tractor',
    year: 2010,
    country: 'Canada',
    gvw: 19000,
    isActive: false
  },
  {
    unit: 'Ken10',
    make: 'Kenworth',
    vin: '12345678',
    plate: 'ABC123',
    subtype: 'Truck Tractor',
    year: 2010,
    country: 'Canada',
    gvw: 19000,
    isActive: false
  },
];

export const List = () => {

  const columns = useMemo<MRT_ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: 'unit',
        header: 'Unit #',
      },
      {
        accessorKey: 'make',
        header: 'Make',
      },
      {
        accessorKey: 'vin',
        header: 'VIN',
      },
      {
        accessorKey: 'plate',
        header: 'Plate',
      },
      {
        accessorKey: 'subtype',
        header: 'Vehicle Subtype',
      },
      {
        accessorKey: 'isActive',
        header: 'Active Permit',
      },
    ],
    [],
  );
  
  return (
    <div className="table-container">
      <MaterialReactTable 
      columns={columns} 
      data={data}
      muiTopToolbarProps={{
        sx: { zIndex: 0 }
      }}
      muiBottomToolbarProps={{
        sx: { zIndex: 0 }
      }}
      />
    </div>
  );
};
