import { GridCellProps, GridRowProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { IBulkUserGrid } from "./BulkUserGrid";

interface CellRenderProps {
    originalProps: GridCellProps;
    td: React.ReactElement<HTMLTableCellElement>;
    enterEdit: (dataItem: IBulkUserGrid, field: string | undefined) => void;
    editField: string | undefined;
}

interface RowRenderProps {
    originalProps: GridRowProps;
    tr: React.ReactElement<HTMLTableRowElement>;
    exitEdit: () => void;
    editField: string | undefined;
}

export const CellRender = (props: CellRenderProps) => {
    const dataItem = props.originalProps.dataItem;
    const cellField = props.originalProps.field;
    const inEditField = dataItem[props.editField || ""];
    const additionalProps =
        cellField && cellField === inEditField
            ? {
                  ref: (td: HTMLTableCellElement) => {
                      const input = td && td.querySelector("input");
                      const activeElement = document.activeElement;

                      if (
                          !input ||
                          !activeElement ||
                          input === activeElement ||
                          !activeElement.contains(input)
                      ) {
                          return;
                      }

                      if (input.type === "checkbox") {
                          input.focus();
                      } else {
                          input.select();
                      }
                  },
              }
            : {
                  onClick: () => {
                      props.enterEdit(dataItem, cellField);
                  },
              };

    const clonedProps: any = { ...props.td.props, ...additionalProps };
    return React.cloneElement(
        props.td,
        clonedProps,
        props.td.props.children as React.ReactNode
    );
};

export const RowRender = (props: RowRenderProps) => {
    const trProps = {
        ...props.tr.props,
        onBlur: () => {
            props.exitEdit();
        },
    };
    return React.cloneElement(
        props.tr,
        { ...trProps },
        props.tr.props.children as React.ReactNode
    );
};
