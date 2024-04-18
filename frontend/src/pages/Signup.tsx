import Quote from '../Components/Quote'
import Auth from '../Components/Auth'
    
    const Signup = () => {
        return (
            <>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div>
                <Auth type='signup'/>
            </div>
            <div className='none lg-block'>
                <Quote/>
            </div>
            </div>
            </>
          )
    }
    
    export default Signup