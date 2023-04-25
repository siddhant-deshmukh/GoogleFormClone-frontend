import { SortableContainer, SortableContainerProps, SortableElement, SortableElementProps, SortableHandle } from "react-sortable-hoc"

export interface ISortableItem extends SortableElementProps {
    children: React.ReactNode
    className?: string
}
export interface ISortableHandleElement {
    children: React.ReactNode
    className?: string
}
export interface ISortableContainer extends SortableContainerProps {
    children: React.ReactNode
    className?: string
}
export const DndItem: React.ComponentClass<ISortableItem, any> = SortableElement(
    ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div className={className || ''}>{children}</div>
    )
)

export const DndList: React.ComponentClass<ISortableContainer, any> = SortableContainer(
    ({ children, className }: { children: React.ReactNode; className: string }) => {
        return <div className={className || ''}>{children}</div>
    }
)

export const DndTrigger: React.ComponentClass<ISortableHandleElement, any> = SortableHandle(
    ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div className={className || ''}>{children}</div>
    )
)