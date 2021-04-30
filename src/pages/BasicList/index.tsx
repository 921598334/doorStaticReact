import React, { useState, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Row, Col, DatePicker, Card, Table, Space, Button, Pagination, message, Modal, Tooltip, Form, InputNumber, Input } from 'antd';
import styles from './index.less'
import { useRequest, useIntl, history, useLocation } from 'umi'

import UserModel from './components/UserModel'
import { ExclamationCircleOutlined, VideoCameraTwoTone, SearchOutlined } from '@ant-design/icons';

import { submintAdaptor,arrAdaptor } from './helper'
//需要安装
import { stringify } from 'qs'
import moment from 'moment'


const myurl = "http://"+window.location.hostname+":8080/"


const index = () => {

    const location = useLocation();
    const { confirm } = Modal;
    const [searchForm] = Form.useForm();

    //搜索区域的显示与不显示
    const [state, setState] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [modelVisible, setModelVisible] = useState(false)
    const [modelUrl, setModelUrl] = useState('')
    const [mothod, setMothod] = useState('get')
    const [modelTitle, setModelTitle] = useState("")
    const [recordTmp, setRecordTmp] = useState({})
    const [dataSourceList, setDataSourceList] = useState([])

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])


    //确认page, perPage变化后在发起请求
    useEffect(() => {
        init.run()
    }, [page, perPage, location.pathname])

    //model的url设置完成后在显示对话框,关闭对话框的时候需要情况地址
    useEffect(() => {
        if (modelUrl) {
            setModelVisible(true)
        }
    }, [modelUrl])



    //初始化，获取基础数据
    const init = useRequest(
        (values) => {
            // message.loading("正在发送请求.....", 1)
            console.log('init发送的参数values为：')
            console.log(values)
            const valuesPara = submintAdaptor(values)
            console.log('init发送的参数valuesPara为：')
            console.log(valuesPara)
            return {
                url: myurl+`newList/api/getPage?page=${page}&per_page=${perPage}`,
                method: 'get',
                params: valuesPara,
                paramsSerializer: (params) => {
                    //参数对象中如果有数组，那对数组用逗号进行分割，合成一个字符串
                    return stringify(params, { arrayFormat: 'comma' })
                }
            }
        }
        , {
            onError: () => {
                console.log('init的失败数据为：', init)
                message.error("查询失败", 1)
            },
            onSuccess: () => {
               
                //message.success("查询完成", 1)
                init.data.datasource = arrAdaptor(init?.data?.datasource)
                console.log('init的成功数据为：', init)
                setDataSourceList(init?.data?.datasource)
            },
        });





    //删除用的请求
    const request = useRequest(
        (values) => {
            message.loading("正在发送请求.....", 1)
            console.log('request发送的参数为：')
            console.log(values)
            return {
                url: myurl+`newList/api${values.url}`,
                method: 'post',
                data: {
                    ...values,
                },
            }
        }
        , {
            manual: true,
            onError: () => {

            },
            //得到后端成功返回全部数据(需要添加这个)
            formatResult: (res) => {
                return res
            },
            //如果没有上面的formatResult的化话，只接收返回数据有data的json，加上后data有后端返回的所有数据
            //{"success":true,"message":"Add successfully.","data":[]}
            onSuccess: (data) => {
                console.log("成功时返回：")
                console.log(data)
                //添加成功就关闭
                message.success(data?.data?.message)

                init.run()
            },
        });







    //关闭修改对话框
    const handleCancel = () => {
        console.log('点击取消，关闭对话框')
        setModelVisible(false)
        setModelUrl('')
    };


    const onFinish = () => {
        console.log('点击提交，关闭对话框')
        setModelUrl("")
        setModelVisible(false)

        //刷新页面
        init.run()
    };



   


    //批量删除对话框
    const batchOverview = (dataSourceTmp) => {

        console.log('点击了删除,需要删除的数据为：')
        console.log(dataSourceTmp)

        return <Table
            size='small'
            rowKey="id"
            dataSource={dataSourceTmp}
            columns={
                [
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '标题',
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'create_time',
                        key: 'create_time',
                    },
                ]
            }
            pagination={false}
        />
    }




    //根据返回的tableColum构建搜索区


    const searchLayout = () => {

        return state ?
            <Card className={styles.searchFrom}>

                <Form
                    form={searchForm}
                    onFinish={(values) => {
                        init.run(values)
                    }}
                >
                    <Row gutter={24}>

                        <Col sm={6}>
                            <Form.Item
                                key='id'
                                label='ID'
                                name='id'
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col sm={6}>
                            <Form.Item
                                key='title'
                                label='标题'
                                name='title'
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>



                        <Col sm={12}>
                            <Form.Item
                                label='创建时间'
                                name='create_time'
                                key='create_time'
                            >
                                <DatePicker.RangePicker

                                    style={{ width: '100%' }}
                                    ranges={{
                                        Today: [moment(), moment()],
                                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    }}
                                    onChange={() => { }}
                                    onOk={() => { }} />
                            </Form.Item>
                        </Col>



                    </Row>

                    <Row>
                        <Col sm={12}>
                        </Col>

                        <Col sm={12} className={styles.tableToolbar}>
                            <Space className={styles.tableToolbar}>
                                <Button type='primary' htmlType='submit'>查询</Button>
                                <Button htmlType='reset' onClick={() => {
                                    init.run();
                                    searchForm.resetFields();
                                }}>清空</Button>
                            </Space>
                        </Col>


                    </Row>
                </Form>

            </Card>
            : ''
    }

    const beforeTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}></Col>
                <Col xs={24} sm={12} className={styles.tableToolbar}>
                    <Space>

                        <Tooltip title="搜索">
                            <Button type={state ? 'primary' : 'default'} shape="circle" icon={<SearchOutlined />} onClick={() => { setState(!state) }} />
                        </Tooltip>

                        <Button
                            type='primary'

                            onClick={(e) => {
                                setModelUrl('/add')
                                setModelTitle("添加")
                                setMothod('post')
                            }}
                        >添加
                        </Button>

                        <Button
                            type="default"
                            onClick={(e) => {
                                init.run()
                            }}
                            loading={init.loading}
                        >刷新
                        </Button>

                    </Space>
                </Col>
            </Row>
        )
    }

    //显示分页
    const afterTableLayout = () => {
        return (
            <Row>
                <Col xs={24} sm={12}>
                </Col>

                <Col xs={24} sm={12} className={styles.tableToolbar}>

                    <Pagination
                        current={init?.data?.meta.page || 0}
                        total={init?.data?.meta.total || 1}
                        pageSize={init?.data?.meta.per_page || 10}
                        onChange={(_page, _perPage) => {
                            console.log('当前选择了：')
                            console.log(_page)
                            console.log('当前显示：')
                            console.log(_perPage)

                            //useState是异步获取数据，也就是下面代码可能同时执行,为了确保值修改后在进行执行，需要useEffect
                            setPage(_page)
                            setPerPage(_perPage)

                        }}
                    />
                </Col>
            </Row>
        )
    }





    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (_selectedRowKeys, _selectedRows) => {
            console.log('选择发生了变化')
            console.log(_selectedRowKeys)
            console.log(_selectedRows)

            setSelectedRowKeys(_selectedRowKeys)
            setSelectedRows(_selectedRows)
        },
    }



    const onDelete = (record) => {

        confirm({
            title: '您确认要删除吗？',
            icon: <ExclamationCircleOutlined />,
            //如果record是空表示是批量删除，否则是删除某一个
            content: batchOverview(record ? [record] : selectedRows),
            onOk() {
                console.log('OK');

                return request.run({
                    url: '/delete',
                    method: 'post',
                    type: 'delete',
                    ids: record ? [record.id] : selectedRows.map((ele)=>{return ele.id}),
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const batchToolBar = () => {

        if (selectedRowKeys?.length > 0) {
            return <Space>

                <Button  type='danger'  onClick={()=>{onDelete(null)}}>批量删除</Button>

            </Space>
        } else {
            return null
        }
    }




    return (
        <PageContainer>
            { searchLayout()}
            <Card>
                {beforeTableLayout()}
                <Table
                    rowKey="id"
                    dataSource={dataSourceList}
                    columns={
                        [
                            {
                                title: 'ID',
                                dataIndex: 'id',
                                key: 'id',
                            },
                            {
                                title: '标题',
                                dataIndex: 'title',
                                key: 'title',
                            },
                            {
                                title: '创建时间',
                                dataIndex: 'create_time',
                                key: 'create_time',
                            },
                            {
                                title: '操作',
                                key: 'operation',
                                fixed: 'right',
                                width: 100,
                                render: (record) => <Space>
                                    <a onClick={(e) => {
                                        console.log('点击了：', record)
                                        setModelUrl(`/edit`)
                                        setModelTitle("编辑")
                                        setMothod('get')
                                        setRecordTmp(record)
                                    }}>编辑</a>

                                    <a onClick={(e) => {

                                        onDelete(record)

                                    }}>删除</a>
                                </Space>,
                            },
                        ]
                    }
                    rowSelection={rowSelection}
                    loading={init.loading}
                    pagination={false}
                />


                {afterTableLayout()}

            </Card>


            <UserModel
                visible={modelVisible}
                handleFinish={onFinish}
                handleCancel={handleCancel}
                modelUrl={modelUrl}
                title={modelTitle}
                method={mothod}
                record={recordTmp}
            ></UserModel>

            <FooterToolbar extra={batchToolBar()} />
        </PageContainer>

    )
}


export default index
