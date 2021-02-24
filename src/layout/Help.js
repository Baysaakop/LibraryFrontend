import React from 'react';
import { Grid, Breadcrumb, Tabs, Typography, Button, Tag } from 'antd';
import { TeamOutlined, DiffOutlined, UnorderedListOutlined, PlusCircleOutlined, BarChartOutlined, HomeOutlined, ReadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

function Help (props) {

    const screens = useBreakpoint();

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">Нүүр</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Тусламж
                </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ margin: '16px 0', padding: '16px', background: '#fff' }}>
                <Title level={4}>
                    Системийн тухай:
                </Title>
                <Paragraph>
                    OTLibrary систем нь ..........-н номын сангийн үйлчилгээний систем бөгөөд номын сан дах нийт номын бүртгэл, номын сангаар үйлчлүүлэгсдийн бүртгэл болон өдөр тутам дах хэрэглэгчдийн ном авах/буцаах захиалгын бүртгэлүүдийг тус тус агуулсан систем юм. Мөн манай системээс хэрэглэгчид хүссэн номоо хайх боломжтой бөгөөд сонирхсон ном нь байхгүй тохиолдолд сар тутам явагдах санал асуулгад сонирхсон номоо санал болгон захиалуулах боломжтой юм.
                </Paragraph>
                <Title level={4}>
                    Системийн бүтэц:
                </Title>
                <Tabs defaultActiveKey={1}>
                        <TabPane key={1} tab={<span><HomeOutlined />Нүүр</span>}>
                            <Tabs tabPosition="left">
                                <TabPane tab={<span><Tag color="green">NEW</Tag>{screens.xs ? '' : 'Шинээр нэмэгдсэн'}</span>} key="new">
                                    <div style={{ padding: '8px' }}>
                                        <Text code>Энэ хэсэгт номын санд шинээр ирсэн номнуудын жагсаалт байрлана.</Text>
                                    </div>
                                </TabPane>
                                <TabPane tab={<span><Tag color="purple">TREND</Tag>{screens.xs ? '' : 'Тренд номнууд'}</span>} key="trend">
                                    <div style={{ padding: '8px' }}>
                                        <Text code>Энэ хэсэгт номын санд хамгийн эрэлттэй буюу хүмүүсийн хамгийн их авч уншсан номнуудын жагсаалт байрлана.</Text>
                                    </div>
                                </TabPane>  
                                <TabPane tab={<span><Tag color="volcano">VOTE</Tag>{screens.xs ? '' : 'Санал асуулга'}</span>} key="vote">
                                    <div style={{ padding: '8px' }}>
                                        <Text code>Энэ хэсэгт номын санд шинээр авчруулахыг хүсч буй номын санал асуулга байрлана.</Text>
                                    </div>
                                </TabPane>                                
                            </Tabs>
                        </TabPane>
                        <TabPane key={2} tab={<span><ReadOutlined />Ном</span>}>
                            
                        </TabPane>  
                        <TabPane key={3} tab={<span><QuestionCircleOutlined />Тусламж</span>}>
                            
                        </TabPane>
                    </Tabs>
            </div>
        </div>
    )
}

export default Help;