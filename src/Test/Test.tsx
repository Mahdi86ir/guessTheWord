import { ChangeEvent, FormEvent , useState } from 'react'
import dataQuiz from '../JSON/Questions.json'
import './Test.css'

interface AlertProps {
  startQuiz:()=>void
}


function StartQuizAlert({startQuiz}:AlertProps){

  return(
    <div className='alert'>
      <div className='alert-text'>
        <h2>مرحله آموزشی به پایان رسید ✅</h2>
        <h3>وارد مرحله اصلی آزمون میشویم.</h3>
      </div>
      <div className="actionParent" id='alertBtn'>
        <span>
          <button onClick={startQuiz} className='btn' >شروع آزمون</button>
        </span>
      </div>
    </div>
  )
}




export default function Test() {
  const [dataIndex , setDataIndex] = useState<number>(1) 
  const [start , setStart] = useState<boolean>(true)
  const [stepCounter , setStepCounter] = useState<number>(0)
  const [ index , setIndex ] = useState<number>(0)
  const [quiz , setQuiz] = useState(dataQuiz[0])
  const [isDisable , setIsDisable] = useState<boolean>(true)
  const [score , setScore] = useState<number>(0)
  const [end , setEnd] = useState<boolean>(false)
  const [answer , setAnswer] = useState<string>('')
  const [scoreStreek , setScoreStreek] = useState<number>(0)
  const [quizAlert , setQuizAlert] = useState<boolean>(false)
  let scoreSum = 0
  const [progress , setProgress] = useState<number>(0)

  
  const addingInputVals = (e:ChangeEvent<HTMLInputElement>) =>{
    setAnswer(e.target.value)
    setIsDisable(false)
  }


  const calcStreek = ():Promise<number> => {
    return new Promise((solved)=>{
      const result = quiz.answer.some(quizAnswer => {
        console.log(quizAnswer, answer)
        return quizAnswer == answer
      })
      
      
      setScoreStreek(prevScore => {
        let newStreek = result ? prevScore + (scoreSum + 1) : 0
        solved(newStreek)
        return newStreek
      })
    })
  }
  

  async function submitForm(e:FormEvent) {
    e.preventDefault()
    if(dataIndex === dataQuiz.length && index == 4){
      setEnd(true)
      console.log(score)
      return
    }

    if(dataIndex == 1 && index == 4){
      setQuizAlert(true)
    }

    const streek:number = await calcStreek()
    

    if(index == 4){
      setStart(false)
      setStepCounter(prevStep => prevStep + 1)
      setDataIndex(prevState => prevState + 1)
      setQuiz(dataQuiz[dataIndex])
      setIndex(0)
      !start && setScore(prevScore => prevScore + streek) 
      setScoreStreek(0)
    }else{
      setIndex(prevIndex => prevIndex+1)
    }
    !start && setProgress(prevProgress => prevProgress + 2)
    setAnswer("")
    setIsDisable(true)
  }

  const startingQuiz = () => {
    setQuizAlert(false)
  }


  return (
    <>
      {quizAlert ? <StartQuizAlert startQuiz={startingQuiz}/> : (
            <form onSubmit={(e)=>submitForm(e)}>
            <div className="progressBarParent">
              <div className="progressInfo">
                <h1>آزمون حدس کلمه</h1>
                {start ? <h2>مرحله تمرینی</h2> : (
                  <>
                    <h2>مرحله {stepCounter}/10</h2>
                    <div className='progress-container'>
                      <p>{progress.toFixed()}%</p>
                      <div className="progress-bar">
                        <div style={{width:`${progress}%`}}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {end ? (<div className='endMassage'>آزمون با موفقیت ثبت شد ! <button className='btn' type="button">بازگشت به صفحه آزمون ها</button></div>) : (
              <>
                <div className="questions">
                  <div className="question">
                    <h2>{quiz.question[index]}</h2>
                    <p> {quiz.word} چیست؟</p>
                    <input type="text" value={answer} maxLength={23} onChange={(e) => addingInputVals(e)} className='inp'/>
                  </div>
                </div>
                <div className="actionParent">
                  <span>
                    <button className='btn' disabled={isDisable} >سوال بعدی</button>
                  </span>
                </div>
              </>
              )}
            </form>
      )}
    </>
  )
}
