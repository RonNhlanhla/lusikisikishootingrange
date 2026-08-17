import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* this is a hero section with all the offerings as well */}
      <div className="flex flex-col items-center">
        <Image src="/training/controlroom.jpg" alt="control room" width={800} height={800} />
      </div>
      <div className="flex flex-col items-center bg-green p-4 gap-2 mb-2">
        <h1 className="text-white">Why train with us?</h1>
        <p className="text-white">At Lusikisiki Hardcore Shooting Range, we stand out as the premier choice for individuals who are new to firearms or seeking to enhance their existing skills. With our extensive industry experience and years of honing our training process, we have mastered the art of making firearms education less intimidating. We provide a supportive and unintimidating environment that encourages continuous growth. Through our well-crafted courses and practice shooting sessions, we offer the perfect blend of theoretical knowledge and practical application. Whether you are a beginner or looking to further develop your skills, Lusikisiki Hardcore Shooting Range is your ideal partner on your journey to becoming a confident and proficient firearms handler.</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>20</h1>
          <p>years of experience</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>1000+</h1>
          <p>Successful SASSETA Students</p>
        </div>

      </div>
      <h1 className="text-center py-2">Department of Justice Control Room Project 2025</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
        <Image src="/cctv/cctv.jpg" alt="cctv" width={800} height={800} />
        <Image src="/cctv/cctv2.jpg" alt="cctv" width={800} height={800} />
        <Image src="/cctv/cctv3.jpg" alt="cctv" width={800} height={800} />
        <Image src="/cctv/cctv4.jpg" alt="cctv" width={800} height={800} />
        <Image src="/cctv/cctv5.jpg" alt="cctv" width={800} height={800} />
        <Image src="/cctv/cctv6.jpg" alt="cctv" width={800} height={800} />
      </div>

    </div>
  )
}