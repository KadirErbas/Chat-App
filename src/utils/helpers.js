// Zaman damgasını okunabilir bir tarih ve saat formatına dönüştür
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.toMillis());
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

//  Mesajlar veya diğer öğeler için benzersiz bir anahtar oluştur
export const generateKey = () => {
    return Math.random().toString(36).substring(2,10);
};

// Zaman göre sıralama
export const sortMessagesByTimestamp = (messages) => {
    return messages.sort(
        (a,b) => a.timestamp.toMillis() - b.timestamp.toMillis()
    );
};