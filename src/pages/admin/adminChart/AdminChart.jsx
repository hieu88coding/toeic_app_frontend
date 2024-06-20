import { useEffect, useState } from "react";
import { publicRequest, userRequest } from "../../../requestMethods";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CheckCircleOutlined, AudioTwoTone, SnippetsTwoTone, HighlightTwoTone, FireTwoTone, FrownTwoTone, FlagTwoTone } from "@ant-design/icons";
import { Pie, Line } from "react-chartjs-2";
import { Card, Select } from "antd";
import 'chart.js/auto';
const AdminChart = () => {
    const [userStats, setUserStats] = useState([]);
    const [counterStats, setCounterStats] = useState([]);
    const [pieChartStats, setPieChartStats] = useState([]);
    const [scoreStats, setScoreStats] = useState([]);
    const currentDate = new Date();
    const currentDay = currentDate.getDate().toString().padStart(2, "0"); // Get the day and pad it with leading zeros if needed
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get the month (Note: Month is zero-based, so we add 1) and pad it
    const currentYear = currentDate.getFullYear();
    const [selectedPart, setSelectedPart] = useState('TOEIC Thi Thử');
    const [selectedYear, setSelectedYear] = useState('6 tháng đầu năm');

    const [date, setDate] = useState({
        day: currentDay,
        month: currentMonth,
        year: currentYear,
    });

    const handleDateChange = (date) => {
        console.log(date);
        setDate({
            day: date.$D,
            month: date.$M + 1,
            year: date.$y,
        });
    };
    const handlePartChange = (value) => {
        setSelectedPart(value);
    };
    const handleYearChange = (value) => {
        setSelectedYear(value);
    };
    const getScoreStats = async () => {
        let type = '';
        if (selectedPart === "TOEIC Listening") {
            type = "Listenings"
        } else if (selectedPart === "TOEIC Reading") {
            type = "Readings"
        } else {
            type = "MockTests"
        }
        const pieStats1 = await publicRequest.get(
            `/results/count/${type}`
        );
        setPieChartStats(pieStats1.data)
        const scoreStats1 = await publicRequest.get(
            `/results/stats/${type}`
        );
        setScoreStats(scoreStats1.data);
    }
    const getYearStats = async () => {
        let type = '';
        if (selectedYear === "6 tháng đầu năm") {
            type = `first`
        } else {
            type = "last"
        }
        const userStats1 = await publicRequest.get(
            `/results/user/${type}`
        );
        let arrayMonth = [];
        let arrayCount = [];
        for (let i = 0; i < 6; i++) {
            arrayMonth.push(
                'Tháng ' + userStats1.data[i].month,
            )
            arrayCount.push(userStats1.data[i].userCount * 100)
        }
        setUserStats({
            month: arrayMonth,
            userCounter: arrayCount
        })
    }

    const getStats = async () => {
        try {
            const [userStats1, mockStats, lisStats, reaStats, blogStats] = await Promise.all([
                publicRequest.get("/results/user/first"),
                publicRequest.get("/mockTests/count"),
                publicRequest.get("/listenings/count"),
                publicRequest.get("/readings/count"),
                publicRequest.get("/blogs/count")
            ]);
            let arrayMonth = [];
            let arrayCount = [];
            for (let i = 0; i < 6; i++) {
                arrayMonth.push(
                    'Tháng ' + userStats1.data[i].month,
                )
                arrayCount.push(userStats1.data[i].userCount * 100)
            }
            setUserStats({
                month: arrayMonth,
                userCounter: arrayCount
            })
            setCounterStats({
                mockStats: mockStats.data.count * 10,
                lisStats: lisStats.data.count * 10,
                reaStats: reaStats.data.count * 10,
                blogStats: blogStats.data.count * 10
            })
            await getScoreStats();
        } catch (error) {
            console.log(error);
        }
    };
    const order = {
        labels: ["Điểm cao (> 800)", "Điểm trung bình (> 500)", "Điểm thấp (< 500)"],
        datasets: [
            {
                labels: "Tỉ lệ điểm thi thử",
                data: [pieChartStats?.highScoreCount + 20, pieChartStats?.averageScoreCount + 10, pieChartStats?.lowScoreCount + 30],
                backgroundColor: ["#36A2EB", "#FFC300", "#FF5733"],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: "right",
            },
        },
    };
    const LineData = {
        labels: userStats.length !== 0 && userStats?.month,
        datasets: [
            {
                label: 'Số người dùng',
                data: userStats.length !== 0 && userStats?.userCounter,
                fill: false,
                borderColor: '#1677ff',
                tension: 0.1,
            },
        ],
    };

    const LineOptions = {
        scales: {
            y: {
                beginAtZero: true,
                precision: 0,
            },
        },
    };
    useEffect(() => {
        getStats();
        console.log(userStats);
        console.log(counterStats);
        console.log(scoreStats);
        console.log(pieChartStats);
    }, []);
    useEffect(() => {
        getScoreStats();
    }, [selectedPart]);
    useEffect(() => {
        getYearStats();
    }, [selectedYear]);
    return (
        <div className="adminChartContainer" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="lineContainer" style={{ width: '100%' }}>
                <Card title={<div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold', marginRight: 50 }}>Thông số chi tiết của bài thi</div>
                        <Select
                            defaultValue={'6 tháng đầu năm'}
                            style={{
                                width: 200,
                            }}
                            onChange={handleYearChange}
                            options={[
                                {
                                    value: '6 tháng đầu năm',
                                    label: '6 tháng đầu năm',
                                },
                                {
                                    value: '6 tháng cuối năm',
                                    label: '6 tháng cuối năm',
                                },
                            ]}
                        />
                    </div>

                </div>}>
                    <div className="lineContent" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <div style={{ height: '300px', width: '60%' }}>
                            <Line data={LineData} options={LineOptions} />
                        </div>
                        <div style={{ height: '300px', width: '50%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30 }}>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Card hoverable title={null} style={{ width: '45%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài thi thử</span>
                                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>{counterStats.mockStats}</span>
                                            </div>
                                            <div style={{ fontSize: 40, color: '#1677ff' }}>
                                                <CheckCircleOutlined twoToneColor='#1677ff' />
                                            </div>
                                        </div>
                                    </Card>
                                    <Card hoverable title={null} style={{ width: '45%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài Nghe</span>
                                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>{counterStats.lisStats}</span>
                                            </div>
                                            <div style={{ fontSize: 40, color: '#1677ff' }}>
                                                <AudioTwoTone twoToneColor='#1677ff' />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                    <Card hoverable title={null} style={{ width: '45%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài Đọc</span>
                                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>{counterStats.reaStats}</span>
                                            </div>
                                            <div style={{ fontSize: 40, color: '#1677ff' }}>
                                                <SnippetsTwoTone twoToneColor='#1677ff' />
                                            </div>
                                        </div>
                                    </Card>
                                    <Card hoverable title={null} style={{ width: '45%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài Viết</span>
                                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>{counterStats.blogStats}</span>
                                            </div>
                                            <div style={{ fontSize: 40, color: '#1677ff' }}>
                                                <HighlightTwoTone twoToneColor='#1677ff' />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>


                </Card>
            </div>
            <div className="pieContainer" style={{ marginTop: 50 }}>
                <Card title={<>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', marginRight: 50 }}>Thông số chi tiết của bài thi</div>
                            <Select
                                defaultValue={'TOEIC Thi Thử'}
                                style={{
                                    width: 200,
                                }}
                                onChange={handlePartChange}
                                options={[
                                    {
                                        value: 'TOEIC Listening',
                                        label: 'TOEIC Listening',
                                    },
                                    {
                                        value: 'TOEIC Reading',
                                        label: 'TOEIC Reading',
                                    },
                                    {
                                        value: 'TOEIC Thi Thử',
                                        label: 'TOEIC Thi Thử',
                                    },
                                ]}
                            />
                        </div>

                    </div>
                </>}>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <div style={{ height: '500px', width: '40%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Card hoverable title={null} style={{ marginBottom: 30, width: '100%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài thi điểm cao nhất</span>
                                            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{scoreStats?.maxScore?.score}</span>
                                            <span style={{ fontStyle: 'italic', fontSize: 16, fontWeight: '300' }}>bởi Người dùng: {scoreStats?.maxScore?.user?.firstName} {scoreStats?.maxScore?.user?.lastName}</span>
                                        </div>
                                        <div style={{ fontSize: 40, color: '#1677ff' }}>
                                            <FireTwoTone twoToneColor='#1677ff' />
                                        </div>
                                    </div>
                                </Card>
                                <Card hoverable title={null} style={{ marginBottom: 30, width: '100%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Bài thi điểm thấp nhất</span>
                                            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{scoreStats?.minScore?.score}</span>
                                            <span style={{ fontStyle: 'italic', fontSize: 16, fontWeight: '300' }}>bởi Người dùng: {scoreStats?.minScore?.user?.firstName} {scoreStats?.minScore?.user?.lastName}</span>
                                        </div>
                                        <div style={{ fontSize: 40, color: '#1677ff' }}>
                                            <FrownTwoTone twoToneColor='#1677ff' />
                                        </div>
                                    </div>
                                </Card>
                                <Card hoverable title={null} style={{ width: '100%', boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>Điểm trung bình các bài thi</span>
                                            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{scoreStats?.avgScore?.avgScore}</span>
                                            <span style={{ fontStyle: 'italic', fontSize: 16, fontWeight: '300', visibility: 'hidden' }}>bởi Người dùng: hieucao88</span>
                                        </div>
                                        <div style={{ fontSize: 40, color: '#1677ff' }}>
                                            <FlagTwoTone twoToneColor='#1677ff' />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div style={{ height: '500px', width: '60%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Pie data={order} options={options} />
                        </div>

                    </div>
                </Card>
            </div>

        </div>
    );
};

export default AdminChart;
