interface Props {
    text: string;
}

export default function SectionTitle({ text }: Props) {
    return (
        <p className="text-section">
            {text}
        </p>
    );
}
