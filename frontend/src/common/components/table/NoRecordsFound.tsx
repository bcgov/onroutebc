import { memo } from "react";

export const NoRecordsFound = memo(() => {
  return (
    <div
      style={{
        padding: "20px 0px",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <div>
        <img
          src="No_Data_Graphic.svg"
          style={{
            width: "124px",
            height: "112px",
            marginTop: "80px",
          }}
        />
      </div>
      <div>
        <h3>No Records Found.</h3>
      </div>
    </div>
  );
});

NoRecordsFound.displayName = "NoRecordsFound";
