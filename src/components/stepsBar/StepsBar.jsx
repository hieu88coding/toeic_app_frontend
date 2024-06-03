import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import "./stepsBar.scss";
import { Card, Steps, Popover, Tooltip } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { publicRequest } from "../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
const customDot = (dot, { status, index }) => (
    <Popover
        content={
            <span>
                Bước {index} Trạng thái: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);
const para = [
    {
        title: 'Foundation',
        //description: 'Bạn có thể hiểu được các từ vựng dễ hiểu, các cụm từ thông dụng. Bạn có thể nắm được các cấu trúc ngữ pháp dựa trên quy tắc phổ biến nhất khi không cần phải đọc nhiều.',
        levelStart: 0,
        levelEnd: 219,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Elementary 1',
        //description: 'Có thể hiểu và sử dụng các cách diễn đạt quen thuộc hàng ngày. Bạn có thể tương tác một cách đơn giản nếu người kia nói chậm và rõ ràng.',
        levelStart: 220,
        levelEnd: 345,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Elementary 2',
        //description: 'Có thể hiểu được những thông tin rất cơ bản về cá nhân và gia đình, mua sắm, địa lý địa phương, việc làm,...). Bạn có thể giao tiếp một cách đơn giản và trực tiếp.',
        levelStart: 346,
        levelEnd: 469,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Intermediate 1',
        //description: 'Bạn có thể chủ động bắt đầu và duy trì các cuộc trò chuyện trực tiếp có thể dự đoán được và đáp ứng các nhu cầu xã hội hạn chế.',
        levelStart: 470,
        levelEnd: 600,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Intermediate 2',
        //description: 'Bạn có thể hiểu được những ý chính trong các văn bản, tài liệu. Bạn có thể giải quyết hầu hết các tình huống khi đi du lịch. Bạn có thể tạo ra văn bản đơn giản.',
        levelStart: 601,
        levelEnd: 729,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Advanced 1',
        //description: 'Bạn có thể đáp ứng được những yêu cầu hạn chế trong công việc và hầu hết các nhu cầu xã hội.',
        levelStart: 730,
        levelEnd: 795,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Advanced 2',
        //description: 'Bạn có thể hiểu được các ý chính của văn bản phức tạp, bao gồm cả các thảo luận chuyên ngành. Bạn có thể tương tác với người bản xứ.',
        levelStart: 796,
        levelEnd: 859,
        style: {
            maxWidth: 550,
        }
    },
    {
        title: 'Proficiency',
        //description: 'Bạn có thể diễn đạt bản thân một cách trôi chảy và tự nhiên. Bạn có thể sử dụng ngôn ngữ một cách linh hoạt và hiệu quả.',
        levelStart: 860,
        levelEnd: 900,
        style: {
            maxWidth: 550,
        }
    },
]

const StepsBar = (props) => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const handleRedoRoadmap = async () => {
        try {
            const res = await publicRequest.delete(`/userLevels/${props.data.id}`);
            console.log(res.data);
            if (res && res.status === 200) {
                navigate('/roadmap/create')
            }

        } catch (error) {
            console.error("Lỗi khi lấy danh sách ảnh:", error);
        }
    }
    useEffect(() => {
        if (props.data.length !== 0) {
            const { levelStart, levelEnd } = props.data;
            setItems([para[levelStart], para[levelEnd]]);
        }
        console.log(items);
    }, [props.data]);
    return (
        <div className="stepsBarContainer">
            <Card title={<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>Lộ trình hiện tại</div><Tooltip title="Set lại lộ trình"><RedoOutlined onClick={() => handleRedoRoadmap()} /></Tooltip></div>} style={{ width: "70%", margin: ' 0 auto' }}>
                <p style={{ paddingBottom: 20 }}>Hãy cố gắng hoàn thành bài tập chúng tôi đề xuất nhé !</p>
                {items.length !== 0 &&
                    <Steps current={0} progressDot={customDot} items={items} />

                }
            </Card>
        </div>
    );
};

export default StepsBar;