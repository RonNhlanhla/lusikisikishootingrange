
import Image from "next/image";
import { Medal, Trophy, Siren, Cctv, HeartHandshake } from "lucide-react";

export default function Page() {
  const sites = ["Department of Energy", "Department of Labour", "Waterworks", "Stats SA", "Rand-Air", "PSIRA", "SASSETA", "ATNS", "SOS Children's Villages", "CCMA", "Saxonwold"]
  return (
    <div>
      {/* this is a hero section with all the offerings as well */}
      <div className="flex flex-col items-center top-30">

        <Image src="/securitysupply/intruderdetection/onyyx wireless alarms.jpg" alt="wireless alarms" width={800} height={800} />

      </div>
      <div className="flex flex-col items-center bg-green p-4 gap-2 mb-2">
        <h1 className="text-white">Why work with us?</h1>
        <p className="text-white">At our company, we take immense pride in delivering top-class intruder detection services that ensure the utmost safety and security for your organization. With years of experience in the industry, we have become the preferred provider for multiple critical governmental organizations and large companies in South Africa. Here&apos;s why we stand out from the competition:</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>500+</h1>
          <p className="sm:text-center">Systems Installed</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>35+</h1>
          <p className="sm:text-center">Sites secured historically</p>
        </div>
      </div>



      <div>
        <div className="p-4 text-center md:text-left">
          <h1>Why Choose Us</h1>
          <p>We take immense pride in delivering top-class intruder detection services that ensure the utmost safety and security for your organization. With years of experience in the industry, we have become the preferred provider for multiple critical governmental organizations and large companies in South Africa. Here&apos;s why we stand out from the competition:</p>
        </div>
        <div className="w-full grid sm:grid-cols-1 p-2 gap-y-2 items-center justify-center">
          <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
            <Trophy size={50} color="#dc2626" />
            <div className="w-2/3"><h3 className="text-center md:text-left">Unparalleled Expertise</h3>
              <p className="text-center md:text-left">With a proven track record of securing numerous sites, our team has overseen the installation and maintenance of a wide range of alarm systems. We have a wealth of knowledge and experience in safeguarding properties and ensuring the safety of our clients.</p></div>
          </div>
          <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
            <Cctv size={50} color="#dc2626" />
            <div className="w-2/3"><h3 className="text-center md:text-left">24/7 Alarm Monitoring</h3>
              <p className="text-center md:text-left">Our operational control room operates 24/7, providing real-time monitoring and support for all our alarm systems. This ensures seamless communication, swift response to triggers, and effective coordination of security measures.</p></div>
          </div>
          <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
            <Medal size={50} color="#dc2626" />
            <div className="w-2/3"><h3 className="text-center md:text-left">Certified Technicians</h3>
              <p className="text-center md:text-left">Our technical team consists of extensively trained and skilled technicians. They are carefully selected for their professionalism, integrity, and ability to handle any installation or maintenance task with utmost efficiency.</p></div>
          </div>
          <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
            <Siren size={50} color="#dc2626" />
            <div className="w-2/3"><h3 className="text-center md:text-left">Rapid Response Integration</h3>
              <p className="text-center md:text-left">Our systems are designed to integrate seamlessly with armed response services. We prioritize quick detection and employ proactive strategies to ensure that any breach is addressed immediately.</p></div>
          </div>
          <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
            <HeartHandshake size={50} color="#dc2626" />
            <div className="w-2/3"><h3 className="text-center md:text-left">Trusted by Governmental Organizations and Large Companies</h3>
              <p className="text-center md:text-left">Our commitment to excellence has earned us the trust and preference of critical governmental organizations and prominent businesses in South Africa. We are proud to have been chosen as the trusted security provider for their vital operations.
              </p></div>
          </div>
        </div>

      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 p-2 items-center justify-center">
        {sites.map((site) => (
          <div key={site} className="p-4 hover:text-white hover:bg-gold hover:border-gold hover:border-0 border-2 text-green border-green">
            <h3>{site}</h3>
          </div>
        ))}
      </div>

    </div>
  )
}