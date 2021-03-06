
module Settlers {
    /**
     * Image with the format:
     *   image1
     *   palette1
     *   image2
     *   palette2
     */
    export class GfxImageWithPalette implements IGfxImage {

        /** start of image data */
        public dataOffset: number;

        /** width of the image */
        public width: number;
        /** height of the image */
        public height: number;

        public chunkHeight: number;

        private data: BinaryReader;

        public flag1: number;
        public flag2: number;
        public rowCount: number;

        private palette: Palette = new Palette();


        private getImageDataWithPalette(buffer: Uint8Array, imgData: Uint8ClampedArray, pos: number, length: number) {
            let j = 0;
            let p = this.palette;

            let i = new Uint32Array(imgData.buffer);
            let chunklength = this.chunkHeight * this.width;
            let c = 0;

            pos -= 256 * 3;

            while (j < length) {
                if (c <= 0) {
                    /// jump over palette data
                    pos += 256 * 3;
                    this.palette.read3BytePalette(buffer, pos + chunklength);
                    c = chunklength;
                }
                c--;

                let index = buffer[pos++];

                i[j++] = p.getColor(index);
            }


            console.log("size : " + (pos - this.dataOffset));
            console.log("left byte: " + (buffer.length - pos));
        }


        public getDataSize(): number {
            return this.width * this.height +
                Math.floor(this.height / this.chunkHeight) * 3 * 256;
        }


        public getImageData(): ImageData {
            let img = new ImageData(this.width, this.height);
            let imgData = img.data;

            let buffer = this.data.getBuffer();
            let length = this.width * this.height;
            let pos = this.dataOffset;

            this.getImageDataWithPalette(buffer, imgData, pos, length);

            return img;
        }

        constructor(reader: BinaryReader, width: number, chunkCount: number) {
            this.data = reader;
            this.chunkHeight = width;
            this.width = width;
            this.height = width * chunkCount;

        }

        public toString(): string {
            return "size: (" + this.width + " x" + this.height + ") "
                + "data offset " + this.dataOffset + " "
                + "rows: " + this.rowCount + "; "
                + "flags: " + this.flag1 + " / " + this.flag2;
        }
    }


}
