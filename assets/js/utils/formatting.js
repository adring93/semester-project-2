export function formatCurrency(amount) {
    const num = Number(amount);
    if (!Number.isFinite(num)) return "$0";
    return `$${num.toLocaleString("en-US")}`;
}

export function formatTimeRemaining(endsAt) {
    const end = new Date(endsAt);
    const diffMs = end.getTime() - Date.now();

    if (!Number.isFinite(end.getTime()) || diffMs <= 0) {
        return "Ended";
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
