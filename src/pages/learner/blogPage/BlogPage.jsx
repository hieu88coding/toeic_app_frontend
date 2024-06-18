import * as React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Steps, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from "../../../firebase";
const BlogPage = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const getBlogs = async () => {
        try {
            let res = await publicRequest.get(
                `/blogs?category=TOEIC Listening`
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
                        contentHTML: res.data[i].contentHTML,
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
            <div style={{ fontWeight: 700, width: '70%', fontSize: 25, marginTop: '50px', marginLeft: 'auto', marginRight: 'auto', }}>BÀI VIẾT</div>
            <div className="blogPageContainer">
                <div style={{
                    width: '70%',
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    marginLeft: 'auto', marginRight: 'auto',
                    marginBottom: 200, fontSize: 18
                }} className="blogPageContent">
                    <div className="topicGroup" style={{ width: '25%', marginTop: '50px', height: 900, display: 'flex', flexDirection: 'column' }}>
                        <div className="groupTitle" style={{ fontSize: 22, fontWeight: 700 }}>Chuyên mục</div>
                        <div className="groupItem" style={{ marginTop: 20 }}>
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
                        {data.length !== 0 && data.map((blog, index) => (
                            <div style={{ width: '100%' }} key={index}>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                    <div style={{ width: '20%', maxWidth: 300, maxHeight: 300 }}>
                                        <img style={{ width: '100%', height: 'auto' }} src={blog.blogImage} alt="" />
                                    </div>
                                    <div style={{ width: '70%', fontSize: 18 }}>
                                        <div style={{ fontWeight: 400, color: 'gray', marginBottom: 10 }}>{blog.contentMarkdown}</div>
                                        <div onClick={() => navigate(`/posts/${blog.id}`)} style={{ fontWeight: 700, marginBottom: 10, cursor: 'pointer' }}>{blog.title}</div>
                                        <div style={{ fontStyle: 'italic', marginBottom: 10 }}>{blog.description}</div>
                                        <div>{blog.createdAt}</div>

                                    </div>

                                </div>
                                <Divider></Divider>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogPage; 