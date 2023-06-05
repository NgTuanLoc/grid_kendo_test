import {
    ChipList,
    Chip,
    ChipProps,
    ChipRemoveEvent,
} from "@progress/kendo-react-buttons";
import { IUpdateFileRecordDetail } from "../interface";
import { convertToChipValueForFileRecordDetail } from "../../utils";
import { useBulkUserGridContext } from "../../context";

interface IMyChipList {
    data: IUpdateFileRecordDetail[];
    className?: string;
}

export const MyChipListTest = ({ data, className }: IMyChipList) => {
    const { removeSolutionFamilyHandler } = useBulkUserGridContext();
    const onRemoveHandler = (event: ChipRemoveEvent) => {
        const value = event.target.props.value;
        removeSolutionFamilyHandler(value.fileRecordId, value);
    };

    const chipValue = convertToChipValueForFileRecordDetail(data);

    return (
        <td className={className}>
            <ChipList
                selection="single"
                data={chipValue}
                chip={(props: ChipProps) => (
                    <Chip
                        onRemove={onRemoveHandler}
                        removable={chipValue.length > 1}
                        {...props}
                    />
                )}
            />
        </td>
    );
};
