import { Image, Modal } from "antd";
// import Image from "next/image";
import { useState } from "react";


export default function ImageViewer({ image }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="">
            <div className="cursor-pointer">
                {image ? <Image
                    src={image}
                    // layout="fill"
                    // width={100}
                    // height={60}
                    // onClick={() => setOpen(true)}
                /> : 'No Image'}
            </div>

            <Modal title="Image" open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} footer={false}>
                <div className="w-80 h-80">
                    <Image
                        src={image}
                        // layout="fill"
                        // onClick={() => setOpen(id)}
                    />
                </div>
            </Modal>
        </div>
    )
}