import React from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { LikeOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import './BookCard.css';
import fallback from '../default-fallback-image.png';

const { Text, Paragraph } = Typography;
const { Meta } = Card;

function BookCard (props) {
    return (
        <Card     
            key={props.item.id}     
            hoverable                          
            cover={
                <div className="cover">
                    <img className="cover-img" src={props.item.image && props.item.image !== null ? props.item.image : fallback} alt="cover" />
                    <div className="cover-overlay">                                                    
                        {props.item.available > 0 ? <span>Бэлэн: {props.item.available}/{props.item.count}</span> : <span>Дууссан</span>}
                    </div>
                </div>
            }
            // actions={[
            //     <LikeOutlined key="like" />,
            //     <EyeOutlined key="watch" />,
            //     <EditOutlined key="edit" />,
            // ]}
        >                                    
            <Meta                                        
                title={
                    <Tooltip title={props.item.name}>
                        <Text>{props.item.name}</Text>                                                    
                    </Tooltip>
                }                              
                description={
                    <Paragraph ellipsis={true}>{props.item.author[0] ? props.item.author[0].name : '---------'}</Paragraph>
                }           
            />             
            {/* {props.item.category.map(cat => {
                return (
                    <span style={{ color: '#adadad' }}>{cat.name} </span>
                );
            })}                                                          */}
        </Card>
    )
}

export default BookCard;