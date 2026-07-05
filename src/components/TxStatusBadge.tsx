export default function TxStatusBadge({ isSuccessful }: { isSuccessful: boolean }) {
    return (
        <div className={`w-2.5 h-2.5 rounded-full ${isSuccessful ? 'bg-green-500' : 'bg-red-500'}`} />
    );
}
