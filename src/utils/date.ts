export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formattedDate; // Formato: 'D de MMMM'
}