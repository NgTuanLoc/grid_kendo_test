import {
    Grid,
    GridColumn,
    GridToolbar,
    GridCellProps,
    GridRowProps,
} from "@progress/kendo-react-grid";

import { CellRender, RowRender } from "./Renderer";
import { useBulkUserGridContext } from "../context";
import { EDIT_FIELD } from "../constants";
import { getDataIndexFromPageIndex } from "../utils";

const MyGrid = () => {
    const {
        data,
        changes,
        gridRef,
        dataIndex,
        page,
        pageChange,
        pageSizeValue,
        enterEdit,
        exitEdit,
        saveChanges,
        cancelChanges,
        itemChange,
        sort,
        isLoading,
        sortChange,
        filter,
        filterChange,
    } = useBulkUserGridContext();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customCellRender: any = (
        td: React.ReactElement<HTMLTableCellElement>,
        props: GridCellProps
    ) => {
        return (
            <CellRender
                originalProps={props}
                td={td}
                enterEdit={enterEdit}
                editField={EDIT_FIELD}
            />
        );
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customRowRender: any = (
        tr: React.ReactElement<HTMLTableRowElement>,
        props: GridRowProps
    ) => (
        <RowRender
            originalProps={props}
            tr={tr}
            exitEdit={exitEdit}
            editField={EDIT_FIELD}
        />
    );

    if (isLoading) {
        return <h1>Loading</h1>;
    }

    return (
        <div>
            <div ref={gridRef}>
                <Grid
                    data={
                        data.data[
                            getDataIndexFromPageIndex(
                                dataIndex,
                                data.pageCached
                            )
                        ]
                    }
                    skip={page.skip}
                    take={page.take}
                    total={data.totalRecords}
                    sortable={{
                        allowUnsort: true,
                        mode: "single",
                    }}
                    sort={sort}
                    filter={filter}
                    filterable={true}
                    onSortChange={sortChange}
                    onFilterChange={filterChange}
                    pageable={{
                        buttonCount: 5,
                        pageSizes: [5, 10, 15],
                        pageSizeValue: pageSizeValue,
                    }}
                    onPageChange={pageChange}
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                    rowHeight={30}
                    dataItemKey={"ProductID"}
                    onItemChange={itemChange}
                    cellRender={customCellRender}
                    rowRender={customRowRender}
                    editField={EDIT_FIELD}
                >
                    <GridToolbar>
                        <button
                            title="Save Changes"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={saveChanges}
                            disabled={!changes}
                        >
                            Save Changes
                        </button>
                        <button
                            title="Cancel Changes"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={cancelChanges}
                            disabled={!changes}
                        >
                            Cancel Changes
                        </button>
                    </GridToolbar>
                    <GridColumn
                        field="id"
                        title="Id"
                        width="50px"
                        editable={false}
                        filterable={false}
                    />
                    <GridColumn field="email" title="Email" width="200px" />
                    <GridColumn
                        field="displayName"
                        title="Display Name"
                        width="200px"
                    />
                    <GridColumn
                        field="firstName"
                        title="First Name"
                        width="200px"
                    />
                    <GridColumn
                        field="lastName"
                        title="Last Name"
                        width="200px"
                    />
                    <GridColumn
                        title="Add Licensed Solutions"
                        field="fileRecordDetail.AddSF"
                        width="200px"
                        editor="boolean"
                    />
                    <GridColumn
                        title="Remove Licensed Solutions"
                        field="fileRecordDetail.RemoveSF"
                        width="200px"
                        editor="boolean"
                    />
                    <GridColumn
                        title="Local Account"
                        field="localAccount"
                        width="200px"
                        editor="boolean"
                    />
                    <GridColumn
                        title="Active Status"
                        field="active"
                        width="200px"
                        editor="boolean"
                    />
                </Grid>
            </div>
        </div>
    );
};

export default MyGrid;
