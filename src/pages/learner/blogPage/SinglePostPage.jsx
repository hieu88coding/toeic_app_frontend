import * as React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Steps, Divider, Breadcrumb } from "antd";
import { UpCircleTwoTone } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from "../../../firebase";
import axios from "axios";
import './singlePostPage.scss';
const SinglePostPage = () => {
    const [data, setData] = useState([])
    const testCode = useLocation().pathname.split("/")[2];
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            setIsVisible(scrollTop > 200);
        };
        window.addEventListener('scroll', handleScroll);

        // Hủy đăng ký sự kiện khi component bị hủy
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getBlogs = async () => {
        try {
            let res = await publicRequest.get(
                `/blogs?id=${testCode}`
            );
            console.log(res);
            if (res.status === 200) {
                console.log(res.data);
                let imageArray = [];
                for (let i = 0; i < res.data.length; i++) {
                    let imagesRefs = await listAll(ref(storage, `Blogs/jpg/${res.data[i].contentMarkdown}/${res.data[i].title}`));
                    let imagesUrls = await Promise.all(
                        imagesRefs.items.map(async (exelRef) => {
                            const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                            return url;
                        })
                    );
                    let exelRefs = await listAll(ref(storage, `Blogs/html/${res.data[i].contentMarkdown}/${res.data[i].title}`));
                    let exelUrls = await Promise.all(
                        exelRefs.items.map(async (exelRef) => {
                            const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                            return url;
                        })
                    );
                    console.log(exelUrls);
                    const response = await axios.get(exelUrls[0]);
                    console.log(imagesUrls);
                    let date = new Date(res.data[i].createdAt);

                    let day = date.getDate();
                    let month = date.getMonth() + 1; // Vì tháng trong JavaScript bắt đầu từ 0
                    let year = date.getFullYear();

                    let formattedDate = `${day}/${month}/${year}`;
                    let temp = {
                        id: res.data[i].id,
                        title: res.data[i].title,
                        blogImage: imagesUrls,
                        contentHTML: response.data,
                        contentMarkdown: res.data[i].contentMarkdown,
                        description: res.data[i].description,
                        createdAt: formattedDate
                    }
                    imageArray.push(temp);
                }
                console.log(imageArray);
                setData(imageArray);
                // setPage(currentPage);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getBlogs()
    }, []);

    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <UpCircleTwoTone
                style={{ fontSize: 30 }}
                twoToneColor="#1677ff"
                className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
                onClick={handleScrollToTop}
            >
                Scroll to Top
            </UpCircleTwoTone>

            <div style={{ fontWeight: 700, width: '70%', fontSize: 25, marginTop: '50px', marginLeft: 'auto', marginRight: 'auto', }}>{data.length !== 0 && data[0].contentMarkdown}</div>
            {data && data.length !== 0 &&
                <div className="singlePostPageContainer">
                    <div style={{
                        width: '70%',
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                        marginLeft: 'auto', marginRight: 'auto',
                        marginBottom: 200, fontSize: 18
                    }} className="SinglePostPageContent">
                        <div className="topicGroup" style={{ width: '25%', marginTop: '50px', height: 900, display: 'flex', flexDirection: 'column' }}>
                            <div className="groupTitle" style={{ fontSize: 20, fontWeight: 700 }}>Chuyên mục</div>
                            <div className="groupItem" style={{ marginTop: 30 }}>
                                <div className="groupItemTitle" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Luyện thi TOEIC</div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, gap: 10 }}>
                                    <div>TOEIC Listening</div>
                                    <div>TOEIC Reading</div>
                                    <div>TOEIC Speaking</div>
                                    <div>TOEIC Writting</div>
                                    <div>Thông tin kỳ thi TOEIC</div>
                                    <div>Kinh nghiệm thi TOEIC</div>
                                </div>
                            </div>
                            <Divider />
                            <div className="groupItem" style={{ marginTop: 30 }}>
                                <div className="groupItemTitle" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Tiếng Anh cơ bản</div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20, gap: 10 }}>
                                    <div>Phát âm</div>
                                    <div>Từ vựng</div>
                                    <div>Ngữ pháp</div>
                                </div>
                            </div>
                        </div>
                        <Divider type="vertical" style={{ height: 'auto' }} />
                        <div style={{ width: '70%', marginTop: '50px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between' }}>
                                <Breadcrumb
                                    items={[
                                        {
                                            title: <a href="http://localhost:5173/blog">Bài viết</a>,
                                        },
                                        {
                                            title: <a href="http://localhost:5173/posts/1">{data[0].contentMarkdown}</a>,
                                        },
                                        {
                                            title: data[0].title
                                        },
                                    ]}
                                />
                                <div style={{ marginBottom: 20, marginTop: 20 }}>{data[0].updatedAt}</div>
                                <div style={{ fontWeight: 700, marginBottom: 20 }}>{data[0].title}</div>
                                <div style={{ fontStyle: 'italic', marginBottom: 50 }}>{data[0].description}</div>
                                <div style={{ width: '50%', margin: '0 auto' }}>
                                    <img style={{ width: '100%', height: 'auto', }} src={data[0].blogImage} alt="" />
                                </div>
                                <div style={{ width: '100%', fontSize: 18, marginTop: 30 }}>
                                    {data.length !== 0 &&
                                        <div dangerouslySetInnerHTML={{ __html: `${data[0].contentHTML}` }}></div>
                                    }


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
};

export default SinglePostPage; 