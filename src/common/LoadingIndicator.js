import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingIndicator() {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

    return (
        <Spin indicator={antIcon} style={{ display: 'block', textAlign: 'center', marginTop: 30 }} />
    );
}
