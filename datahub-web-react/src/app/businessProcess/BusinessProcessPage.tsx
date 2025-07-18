import React from 'react';
import styled from 'styled-components';
import { Card, Typography, Row, Col, Statistic, Button, Tag } from 'antd';
import { FlowArrow, ChartLineUp, Users, Clock, Plus, Car, User, CreditCard, Shield, MapPin } from '@phosphor-icons/react';

const { Title, Paragraph } = Typography;

const BusinessProcessContainer = styled.div`
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    height: 100vh;
    overflow-y: auto;
`;

const ProcessCard = styled(Card)`
    margin-bottom: 24px;
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

const ProcessIcon = styled(FlowArrow)`
    font-size: 24px;
    color: #1890ff;
`;

const StatsRow = styled(Row)`
    margin-bottom: 24px;
`;

const StatCard = styled(Card)`
    text-align: center;
`;

const BusinessProcessCard = styled(Card)`
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 200px;
    display: flex;
    flex-direction: column;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
`;

const CreateCard = styled(Card)`
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px dashed #d9d9d9;
    background: #fafafa;
    height: 200px;
    display: flex;
    flex-direction: column;
    
    &:hover {
        border-color: #1890ff;
        background: #f0f8ff;
    }
`;

const CardContent = styled.div`
    text-align: center;
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`;

const BusinessProcessIcon = styled.div`
    font-size: 32px;
    margin-bottom: 12px;
    color: #1890ff;
`;

const CreateIcon = styled(Plus)`
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
`;

const StatusTag = styled(Tag)`
    margin-top: 8px;
`;

export const BusinessProcessPage: React.FC = () => {
    return (
        <BusinessProcessContainer>
            <IconContainer>
                <ProcessIcon weight="fill" />
                <Title level={2} style={{ margin: 0 }}>
                    Business Process Management
                </Title>
            </IconContainer>
            
            <StatsRow gutter={16}>
                <Col span={6}>
                    <StatCard>
                        <Statistic
                            title="Active Processes"
                            value={12}
                            prefix={<FlowArrow size={20} />}
                        />
                    </StatCard>
                </Col>
                <Col span={6}>
                    <StatCard>
                        <Statistic
                            title="Process Performance"
                            value={94.2}
                            suffix="%"
                            prefix={<ChartLineUp size={20} />}
                        />
                    </StatCard>
                </Col>
                <Col span={6}>
                    <StatCard>
                        <Statistic
                            title="Team Members"
                            value={8}
                            prefix={<Users size={20} />}
                        />
                    </StatCard>
                </Col>
                <Col span={6}>
                    <StatCard>
                        <Statistic
                            title="Avg. Cycle Time"
                            value={3.5}
                            suffix="days"
                            prefix={<Clock size={20} />}
                        />
                    </StatCard>
                </Col>
            </StatsRow>

            <Row gutter={[16, 16]}>
                {/* Create New Process Card */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <CreateCard>
                        <CardContent>
                            <CreateIcon />
                            <Title level={4} style={{ margin: 0, color: '#8c8c8c' }}>
                                Create New Process
                            </Title>
                            <Paragraph style={{ color: '#8c8c8c', margin: 0 }}>
                                Add a new business process
                            </Paragraph>
                        </CardContent>
                    </CreateCard>
                </Col>

                {/* Driver Onboarding Process */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <User weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Driver Onboarding
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Background checks, vehicle verification, and training
                                </Paragraph>
                            </div>
                            <StatusTag color="green">Active</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Ride Matching Process */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <MapPin weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Ride Matching
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Algorithm-based driver-rider pairing
                                </Paragraph>
                            </div>
                            <StatusTag color="green">Active</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Payment Processing */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <CreditCard weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Payment Processing
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Secure payment handling and settlement
                                </Paragraph>
                            </div>
                            <StatusTag color="green">Active</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Safety Monitoring */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <Shield weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Safety Monitoring
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Real-time safety alerts and incident response
                                </Paragraph>
                            </div>
                            <StatusTag color="blue">Monitoring</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Fleet Management */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <Car weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Fleet Management
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Vehicle tracking and maintenance scheduling
                                </Paragraph>
                            </div>
                            <StatusTag color="green">Active</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Customer Support */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <User weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Customer Support
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Issue resolution and customer satisfaction
                                </Paragraph>
                            </div>
                            <StatusTag color="orange">Pending</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Surge Pricing */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <ChartLineUp weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Surge Pricing
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Dynamic pricing based on demand
                                </Paragraph>
                            </div>
                            <StatusTag color="green">Active</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>

                {/* Driver Incentives */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <BusinessProcessCard>
                        <CardContent>
                            <div>
                                <BusinessProcessIcon>
                                    <FlowArrow weight="fill" />
                                </BusinessProcessIcon>
                                <Title level={4} style={{ margin: 0 }}>
                                    Driver Incentives
                                </Title>
                                <Paragraph style={{ margin: '8px 0' }}>
                                    Bonus programs and reward systems
                                </Paragraph>
                            </div>
                            <StatusTag color="purple">Planning</StatusTag>
                        </CardContent>
                    </BusinessProcessCard>
                </Col>
            </Row>
        </BusinessProcessContainer>
    );
}; 