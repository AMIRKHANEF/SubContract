interface Props {
    children?: React.ReactNode;
}

export default function Content({ children }: Props) {
    return (
        <div className="h-[calc(100vh-114px)] overflow-y-auto">
            {children}
        </div>
    );
}
