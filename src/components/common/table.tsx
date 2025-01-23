/* eslint-disable @typescript-eslint/no-explicit-any */

import { transformTableData, TTransformableTableData } from "@/utils/helpers";
import { Spinner } from "@material-tailwind/react";
import { ReactNode, useRef } from "react";

interface ITable<T> {
  tableHeader: any[];
  tableData: any[] | TTransformableTableData<T>;
  dimensions?: any[];
  isLoading?: boolean;
  transform?: boolean;
  placeholder?: ReactNode;
  loader?: ReactNode;
  fieldsAlignment?: ("left" | "right" | "center")[];
  rowClassName?: string;
  rowOperation?: { onClick: (item: T) => void; exempt: number[] };
}

export function TableDefault({
  tableHeader,
  tableData,
  dimensions,
  isLoading,
  transform,
  placeholder,
  loader,
  rowClassName,
  rowOperation
}: ITable<any>) {
  const loaderRef = useRef<HTMLDivElement>(null);

  let mainTableData = [];

  if (transform) {
    mainTableData = transformTableData(
      (tableData ?? []) as TTransformableTableData<any>
    );
  } else {
    mainTableData = (tableData ?? []) as any[];
  }

  const rowOperationAction = (index: number) => {
    if (rowOperation?.onClick) {
      rowOperation?.onClick((tableData as any)?.data[index]);
    }
  };

  return (
    <>
      <div
        ref={loaderRef}
        className="w-full pb-3 transition-all flex items-center bg-[hsl(var(--foreground)/0.01)] "
        style={
          isLoading
            ? {
                height: loaderRef?.current?.offsetHeight + "px"
              }
            : {
                height: 0,
                paddingBlock: 0,
                overflow: "hidden"
              }
        }
      >
        {loader || (
          <div className="w-full text-xs flex items-center justify-center gap-3">
            <Spinner
              className="w-5 h-5 "
              onPointerEnterCapture
              onPointerLeaveCapture
            />
          </div>
        )}
      </div>
      <table className="w-full overflow-hidden font-normal mx-auto text-left [&_tr]:!border-x-0 [&_td]:!border-x-0 [&_th]:!border-x-0">
        <thead>
          <tr className="flex border-b border-line-separation msm:table-row py-3 px-2">
            {tableHeader.map((header, index) => (
              <th
                key={index}
                //colSpan={getColSpan(dimensions[index])}
                className={`overflow-clip w-full flex items-center msm:!table-cell font-medium text-grey tracking-wide text-xs`}
                style={{
                  width:
                    (dimensions &&
                      dimensions[index] &&
                      dimensions[index] + "%") ||
                    "auto"
                }}
              >
                {/* <Typography
                    variant="small"
                    color="black"
                    className="text-[#747474] py-[15px] text-xs font-semibold leading-none opacity-70 uppercase !h-full w-full block items-center msm:!items-start "
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <div className=" w-full px-2 msm:!text-[0.1rem] !text-[0.7rem] ">
                    </div>
                  </Typography> */}
                {header}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>

        {(mainTableData.length > 0) ? (
          <tbody
            style={{
              opacity: (isLoading && 0.5) || undefined
            }}
          >
            {mainTableData.map((row: any, rowIndex: number) => (
              <tr
                key={rowIndex}
                style={
                  dimensions && {
                    display: "flex"
                  }
                }
                className={
                  rowClassName +
                  " w-full border-b border-r px-2 border-line-separation leading-10 capitalize md:text-base text-sm msm:!table-row"
                }
              >
                {row.map((field: any, index: number) => (
                  <>
                    <td
                      colSpan={index == 2 ? 2 : 1}
                      key={index}
                      className="!py-2 items-center  md:p-0  text-sm  border-l  border-line-separation msm:!table-cell"
                      style={{
                        ...(dimensions &&
                          dimensions[index] && {
                            width: dimensions[index] + "%" || "auto",
                            display: "flex"
                          })
                      }}
                      {...(!rowOperation?.exempt.includes(index) && {
                        onClick() {
                          rowOperationAction(rowIndex);
                        }
                      })}
                    >
                      <div className="">{field}</div>
                    </td>
                  </>
                ))}
              </tr>
            ))}

            <tr>
              {tableHeader.map((_, index) => (
                <td
                  key={index}
                  className="!py-[15px]  md:p-0  text-sm  border-l  border-[#DBDBDB] msm:!table-cell"
                ></td>
              ))}
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={tableHeader.length}
                className=" w-full p-3 items-center justify-center "
              >
                {placeholder || "No data to display"}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
}
