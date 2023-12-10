import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./examSheet.scss";
import { Anchor, Card } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import { publicRequest } from "../../requestMethods";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../firebase';



const ExamSheet = () => {
    const [stats, setStats] = useState([]);
    const data = [];
    const getStats = async () => {
        try {
            const res = await publicRequest.get(`/mockTests/Test${1}`);
            const imageRefs = await listAll(ref(storage, res.data.images)); // Lấy danh sách các file trong thư mục

            const imageUrls = await Promise.all(
                imageRefs.items.map(async (imageRef) => {
                    const url = await getDownloadURL(imageRef); // Tải xuống từng ảnh
                    // data.push(url);
                    return url;
                })
            );

            console.log(data);

            const stats = imageUrls.map((url, index) => ({
                name: imageRefs.items[index].name,
                url: url,
            }));
            stats.sort((a, b) => {
                const indexA = parseInt(a.name.split('_')[1]);
                const indexB = parseInt(b.name.split('_')[1]);
                return indexA - indexB;
            });

            setStats(stats);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    };
    useEffect(() => {
        getStats();
    }, []);
    console.log(stats);


    const handleAnchorClick = (e, link) => {
        // e.stopPropagation();
        e.preventDefault();

        console.log(link);
    };

    return (
        <div>
            <div className="examSheetContainer">
                <Anchor
                    onClick={handleAnchorClick}
                    affix={false}
                    direction="horizontal"
                    items={[
                        {
                            key: 'Part 1',
                            href: '#image_1.png',
                            title: 'Part 1',
                        },
                        {
                            key: 'Part 2',
                            href: '#image_4.png',
                            title: 'Part 2',

                        },
                        {
                            key: 'Part 3',
                            href: '#image_5.png',
                            title: 'Part 3',
                        },
                        {
                            key: 'Part 4',
                            href: '#image_9.png',
                            title: 'Part 4',
                        },
                        {
                            key: 'Part 5',
                            href: '#image_13.png',
                            title: 'Part 5',
                        },
                        {
                            key: 'Part 6',
                            href: '#image_16.png',
                            title: 'Part 6',
                        },
                        {
                            key: 'Part 7',
                            href: '#image_20.png',
                            title: 'Part 7',
                        },
                    ]}
                />

                <Card title={null}>
                    <Scrollbar options={{
                        suppressScrollX: true
                    }} style={{ maxHeight: 570 }}>
                        <div id="scrollContent">
                            {stats && stats.map((image) => (
                                <img id={image.name} style={{ width: '50%', height: 'auto' }} key={image.name} src={image.url} alt={image.name} />
                            ))}
                        </div>
                    </Scrollbar>
                </Card>



            </div>
        </div>
    );
};

export default ExamSheet; 