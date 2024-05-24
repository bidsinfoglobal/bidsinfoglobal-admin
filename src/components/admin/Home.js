import React, { useEffect, useState } from 'react'
import CustomerChart from '../Common/CustomerChart'
import { FileTextOutlined } from '@ant-design/icons'
import { fetchDashboardData } from '../../apis/dashboard.api'

export default function Home() {
  const [boxData, setBoxData] = useState({
    contracts: 0,
    grants: 0,
    projects: 0,
    tenders: 0,
  });
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    fetchDashboardData()
    .then(data => {
      setBoxData(() => ({
        contracts: data.contracts,
        grants: data.grants,
        projects: data.projects,
        tenders: data.tenders,
      }));
      setCustomerData({
        labels: Object.keys(data?.customerData) || "",
        data: Object.values(data?.customerData) || ""
      });
    })
    .catch(() => {})
  }, [])
  
  return (
    <div>
      <div className='grid md:gap-8 gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4'>
        <Card title={'Grants'} value={boxData.contracts} />
        <Card title={'Tenders'} value={boxData.tenders} />
        <Card title={'Projects'} value={boxData.projects} />
        <Card title={'Contracts'} value={boxData.contracts} />
      </div>
      <div className='mt-8'>
        <CustomerChart data={customerData} />
      </div>
    </div>
  )
}

function Card ({ title, value }) {
  return <div className="bg-gray-100 shadow to-white/5 p-6 rounded-lg">
  <div className="flex flex-row gap-6 items-center">
      <div id="stats-1">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg> */}
          <FileTextOutlined className='' style={{ fontSize: '180%' }} />
      </div>
      <div className='space-y-2'>
          <div className='flex items-center gap-4'>
              <p className="text-lg font-medium capitalize leading-4">{title}</p>
              {/* <span>span</span> */}
          </div>
          <p className="font-bold text-2xl inline-flex items-center space-x-2">
              <span>{value}</span>
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
              </span>
          </p>
      </div>
  </div>
</div>
}
