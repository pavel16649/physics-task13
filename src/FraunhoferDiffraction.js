import React, {useCallback, useState} from "react";
import Plot from "react-plotly.js";
import "./main.css"

function FraunhoferDiffraction() {
    const [N, setN] = useState(4);
    const [b, setB] = useState(0.032);
    const [d, setD] = useState(0.069);
    const [lambda, setLambda] = useState(650);
    const [I0, setI0] = useState(1);
    const [intensity, setIntensity] = useState([]);
    const [angle, setAngle] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleCloseModal1 = () => {
        setShowModal1(false);
    }

    const calculateIntensity = useCallback(() => {
        const intensityValues = [];
        const angleValues = [];

        const b1 = b / 1000;
        const d1 = d / 1000;
        const lambda1 = lambda / 1e9;

        for (let phi = -Math.PI / 6 / 10; phi < Math.PI / 6 / 10; phi += 0.00001) {
            const i_phi = I0 * Math.pow(Math.sin(Math.PI * b1 / lambda1 * Math.sin(phi)) / (Math.PI * b1 / lambda1 * Math.sin(phi)), 2);
            const i_n = i_phi * Math.pow(Math.sin(Math.PI * N * d1 / lambda1 * Math.sin(phi)) / Math.sin(Math.PI * d1 / lambda1 * Math.sin(phi)), 2);
            intensityValues.push(i_n);
            angleValues.push(phi);
        }

        setIntensity(intensityValues);
        setAngle(angleValues);
    }, [N, b, d, lambda, I0]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (N <= 0 || d <= 0 || b <= 0 || I0 <= 0 || lambda <= 0) {
            setShowModal(true);
            return;
        }

        if (Math.ceil(N) != N) {
            setShowModal1(true);
            return;
        }

        calculateIntensity();
    };

    return (
        <div className='body'>
            <h1>Дифракция Фраунгофера на решетке из нескольких щелей</h1>
            <div className='inputs'>
                <div className='input'>
                    Количество щелей (N):
                    <input type="number" value={N} step='1' onChange={(e) => setN(e.target.value)}/>
                </div>
                <br/>
                <div className='input'>
                    Ширина щели, мм (a):
                    <input type="number" value={b} step='0.001' onChange={(e) => setB(e.target.value)}/>
                </div>
                <br/>
                <div className='input'>
                    Расстояние между щелями, мм (d):
                    <input type="number" value={d} step='0.001' onChange={(e) => setD(e.target.value)}/>
                </div>
                <br/>
                <div className='input'>
                    Длина волны источника, нм (λ):
                    <input type="number" value={lambda} onChange={(e) => setLambda(e.target.value)}/>
                </div>
                <br/>
                <div className='input'>
                    Интенсивность, Вт/м^2 (I0):
                    <input type="number" value={I0} onChange={(e) => setI0(e.target.value)}/>
                </div>
                <br/>
            </div>
            <div className='input'>
                <button type="button" onClick={handleSubmit}>Построить</button>
            </div>
            <Plot
                data={[
                    {
                        x: angle,
                        y: intensity,
                        type: 'line',
                        name: 'Интенсивность',
                    },
                ]}
                layout={{
                    title: 'Зависимость интенсивности от угла дифракции',
                    xaxis: {
                        title: 'Угол (рад)',
                    },
                    yaxis: {
                        title: 'Интенсивность (Вт/м^2)',
                    },
                }}
            />
            {showModal && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Предупреждение</h2>
                        <p>Ни одно из значений не может быть неположительным</p>
                        <button onClick={handleCloseModal}>Попробую другие</button>
                    </div>
                </div>
            )}
            {showModal1 && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Предупреждение</h2>
                        <p>Количество щелей N должно быть целым положительным числом</p>
                        <button onClick={handleCloseModal1}>Попробую другое</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FraunhoferDiffraction;