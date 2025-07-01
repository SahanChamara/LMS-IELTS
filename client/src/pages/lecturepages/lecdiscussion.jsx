import LecSidebar from './lecsidebar'

import UnitwiseChatLoad from '../../components/lecpagescomponents/unitwisechat'


function LecDiscussion() {
  const handleLogout = () => {
    // logout logic here
  }

  return (
     <div className='flex min-h-screen'>
      <LecSidebar onLogout={handleLogout} />
      <div className='flex-1 p-6 flex flex-col'>
        <h1 className='text-2xl font-bold p-2 mb-2'>Lecture Discussion</h1>


      <UnitwiseChatLoad />
    </div>
    </div>
  )
}

export default LecDiscussion
