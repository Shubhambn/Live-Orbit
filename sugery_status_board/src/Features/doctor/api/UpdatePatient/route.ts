import{NextResponse} from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath=path.join(process.cwd(),'src/app/data/PatientsData.json')

export async function POST(req:Request){
    const {id,status}= await req.json();
    try{
        const fileData = fs.readFileSync(filePath,'utf-8')
        const patient =JSON.parse(fileData)

        const updatedPatients=patient.map((p:any)=>
            p.id===id?{...p,status}:p
        )

        fs.writeFileSync(filePath,JSON.stringify(updatedPatients,null,2),'utf-8')
        return NextResponse.json({success:true})
    }   catch(err){
        console.error(err)
        return NextResponse.json({error:'Failed to update'},{status:500})
    }
}