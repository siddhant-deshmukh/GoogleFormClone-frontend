import { useAppDispatch } from "../../app/hooks"
import { functionForSorting } from "../../features/form/formSlice"
import { IAllFormQuestions } from "../../types"
import QuestionFormElement from "./edit-question"
import { DndItem, DndList } from "./react-sortable-hoc"

const SortableQueList = ({ queSeq, allQuestions, selectedKey, selectQuestionRef }: {
    queSeq: {
        id: string;
        index?: number | undefined;
    }[],
    allQuestions: IAllFormQuestions,
    selectedKey: string | undefined,
    selectQuestionRef: React.MutableRefObject<HTMLDivElement | null>
}) => {

    const dispatch = useAppDispatch()
    const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void => {
        dispatch(functionForSorting({ oldIndex, newIndex }))
    }

    return (

        <DndList
            lockAxis="y"
            lockToContainerEdges={true}
            useDragHandle
            onSortEnd={onSortEnd}
            className="itemsContainer"
        >
            {queSeq.map((ele: any, index: number) => {
                let isSelected = (selectedKey === ele.id.toString()) ? 'true' : 'false'
                if (!allQuestions[ele.id.toString()]) return <></>

                return (
                    <DndItem key={ele.id} index={index} className="item my-2">
                        <QuestionFormElement
                            key={ele.id}
                            queKey={ele.id}
                            question={allQuestions[ele.id.toString()]}
                            isSelected={isSelected}
                            selectQuestionRef={selectQuestionRef}
                        />
                    </DndItem>
                )
            })}
        </DndList>

    )
}

export default SortableQueList