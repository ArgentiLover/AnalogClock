import React, { useState, useEffect } from 'react';
import { Moon, Sun, Calendar, Clock, Settings, Palette, Type } from 'lucide-react';
import './App.css';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);
  
  // Состояния для настроек внешнего вида
  const [clockStyle, setClockStyle] = useState('arabic'); // 'arabic', 'roman', 'minimal'
  const [handColor, setHandColor] = useState('classic'); // 'classic', 'ocean', 'gold'
  const [showSettings, setShowSettings] = useState(false);

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Расчет градусов поворота
  // Секундная стрелка: 6 градусов/секунда
  const secondDegrees = seconds * 6;
  // Минутная стрелка: 6 градусов/минута + 0.1 градус/секунда (для плавности)
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  // Часовая стрелка: 30 градусов/час + 0.5 градуса/минута (для плавности)
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;

  // Форматирование даты
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = time.toLocaleDateString('ru-RU', dateOptions);
  const dateString = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Определение цвета часовой и минутной стрелок
  const getHandColor = () => {
    switch (handColor) {
      case 'ocean':
        return isDark ? '#38bdf8' : '#0284c7'; // Голубой/Синий
      case 'gold':
        return isDark ? '#facc15' : '#ca8a04'; // Золотой
      default: // classic
        return isDark ? '#e2e8f0' : '#1e293b'; // Светлый/Темный (стандарт)
    }
  };

  const handStroke = getHandColor();

  // Генерация делений циферблата
  const renderMarks = () => {
    const marks = [];
    for (let i = 0; i < 60; i++) {
      const isHourMark = i % 5 === 0;
      const angle = i * 6;
      
      // Параметры отметки
      const length = isHourMark ? 8 : 4; 
      const width = isHourMark ? 2 : 0.5; 
      const startY = 2; // Прижимаем отметки к краю
      
      const color = isDark ? (isHourMark ? '#94a3b8' : '#475569') : (isHourMark ? '#475569' : '#cbd5e1');
      
      marks.push(
        <line
          key={i}
          x1="50"
          y1={startY}
          x2="50"
          y2={startY + length}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
        />
      );
    }
    return marks;
  };

  // Цифры на циферблате
  const renderNumbers = () => {
    if (clockStyle === 'minimal') return null;

    const isRoman = clockStyle === 'roman';
    
    const numbers = [
      { num: isRoman ? 'XII' : '12', angle: 0 },
      { num: isRoman ? 'III' : '3', angle: 90 },
      { num: isRoman ? 'VI' : '6', angle: 180 },
      { num: isRoman ? 'IX' : '9', angle: 270 }
    ];

    // Радиус расположения цифр
    const radius = 32; 

    return numbers.map(({ num, angle }) => {
      // Преобразование углов в координаты (x, y)
      const radian = (angle - 90) * (Math.PI / 180);
      const x = 50 + radius * Math.cos(radian);
      const y = 50 + radius * Math.sin(radian);

      return (
        <text
          key={num}
          x={x}
          y={y + (isRoman ? 0 : 0.5)} // Небольшая поправка по вертикали
          textAnchor="middle"
          dominantBaseline="middle"
          className={`clock-number ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
          style={{ fontFamily: isRoman ? 'serif' : 'sans-serif' }}
        >
          {num}
        </text>
      );
    });
  };

  return (
    <div className={`app-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
      
      {/* Главный контейнер карточки */}
      <div className={`clock-card ${isDark ? 'dark-card' : 'light-card'}`}>
        
        {/* Заголовок и кнопки управления */}
        <div className="header">
          <div className="title">
            <Clock className={`icon ${isDark ? 'dark-icon' : 'light-icon'}`} />
            <h1>Время</h1>
          </div>
          
          <div className="controls">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`control-btn ${showSettings ? (isDark ? 'active-dark' : 'active-light') : (isDark ? 'inactive-dark' : 'inactive-light')}`}
              title="Настройки вида"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`theme-toggle ${isDark ? 'dark-toggle' : 'light-toggle'}`}
              title="Переключить тему"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Панель настроек */}
        {showSettings && (
          <div className={`settings-panel ${isDark ? 'dark-settings' : 'light-settings'}`}>
            <div className="settings-content">
              
              {/* Выбор стиля цифр */}
              <div className="setting-row">
                <div className="setting-label">
                  <Type size={16} />
                  <span>Циферблат</span>
                </div>
                <div className="style-buttons">
                  {['arabic', 'roman', 'minimal'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setClockStyle(style)}
                      className={`style-btn ${clockStyle === style ? (isDark ? 'style-active-dark' : 'style-active-light') : 'style-inactive'}`}
                    >
                      {style === 'arabic' ? '12' : style === 'roman' ? 'XII' : 'Empty'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Выбор цвета стрелок */}
              <div className="setting-row">
                <div className="setting-label">
                  <Palette size={16} />
                  <span>Стрелки</span>
                </div>
                <div className="color-buttons">
                  {[
                    { id: 'classic', color: isDark ? '#e2e8f0' : '#1e293b' },
                    { id: 'ocean', color: '#0ea5e9' },
                    { id: 'gold', color: '#eab308' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setHandColor(option.id)}
                      className={`color-btn ${handColor === option.id ? 'color-active' : 'color-inactive'}`}
                      style={{ backgroundColor: option.color }}
                      title={option.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Аналоговые Часы (SVG) */}
        <div className="clock-container">
          {/* Эффект свечения под часами */}
          <div className={`glow-effect ${isDark ? 'dark-glow' : 'light-glow'}`}></div>
          
          <svg viewBox="0 0 100 100" className="clock-svg">
            {/* Основа циферблата */}
            <circle 
              cx="50" 
              cy="50" 
              r="48" 
              className={`clock-face ${isDark ? 'dark-face' : 'light-face'}`}
            />
            
            {/* Маркеры и цифры */}
            {renderMarks()}
            {renderNumbers()}

            {/* Часовая стрелка */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28" 
              stroke={handStroke}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${hourDegrees} 50 50)`}
              className="hour-hand"
            />

            {/* Минутная стрелка */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18" 
              stroke={handStroke}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${minuteDegrees} 50 50)`}
              className="minute-hand"
            />

            {/* Секундная стрелка (осталась красной) */}
            <g transform={`rotate(${secondDegrees} 50 50)`}>
              <line
                x1="50"
                y1="60"
                x2="50"
                y2="10"
                stroke="#ef4444" 
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <circle cx="50" cy="60" r="1.5" fill="#ef4444" />
            </g>

            {/* Центральная точка */}
            <circle cx="50" cy="50" r="2" className={`center-dot ${isDark ? 'dark-center' : 'light-center'}`} />
          </svg>
        </div>

        {/* Цифровое время и Дата */}
        <div className="digital-display">
          <div className={`digital-time ${isDark ? 'dark-time' : 'light-time'}`}>
            {time.toLocaleTimeString('ru-RU')}
          </div>
          
          <div className={`date-display ${isDark ? 'dark-date' : 'light-date'}`}>
            <Calendar size={16} />
            <span>{dateString}</span>
          </div>
        </div>

      </div>
    </div>
  );
}