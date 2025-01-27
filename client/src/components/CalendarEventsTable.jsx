import React, { useState, useEffect } from "react";

const CalendarEventsTable = ({ events }) => {
  // Функция для фильтрации и группировки данных
  const processEvents = (items) => {
    const groupedEvents = {};
  
    // Обновленное регулярное выражение для удаления постфиксов
    const postfixRegex = /\s*(\([^)]+\)|observed|\(tentative\)|Suspended)+/g;
  
    items.forEach((item) => {
      const { summary, description, start } = item;
  
      // Убираем все постфиксы из summary
      const cleanedSummary = summary.replace(postfixRegex, '').trim();
  
      if (!groupedEvents[cleanedSummary]) {
        groupedEvents[cleanedSummary] = { description, dates: [] };
      }
  
      groupedEvents[cleanedSummary].dates.push(start.date);
    });
  
    // Преобразовать в массив и отсортировать даты
    return Object.entries(groupedEvents).map(([summary, data]) => ({
      summary,
      description: data.description,
      dates: [...new Set(data.dates)].sort(), // Удаляем дублирующиеся даты и сортируем
    }));
  };
  
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    if (events) {
      setProcessedData(processEvents(events.items));
    }
  }, [events]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Календарь событий</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Название события</th>
            <th className="py-2 px-4 border-b">Описание</th>
            <th className="py-2 px-4 border-b">Даты</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((event, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 font-semibold">{event.summary}</td>
              <td className="py-2 px-4">{event.description || "—"}</td>
              <td className="py-2 px-4">
                {event.dates.map((date) => (
                  <span
                    key={date}
                    className="inline-block bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded-lg mr-2 mb-1"
                  >
                    {date}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarEventsTable;
