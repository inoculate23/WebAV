
declare module 'mp4box' {

  export interface MP4MediaTrack {
    id: number
    created: Date
    modified: Date
    movie_duration: number
    layer: number
    alternate_group: number
    volume: number
    track_width: number
    track_height: number
    timescale: number
    duration: number
    bitrate: number
    codec: string
    language: string
    nb_samples: number
    mdia: {
      minf: {
        stbl: {
          stsd: {
            entries: Array<Record<'avcC' | 'hvcC', MP4Box>>
          }
        }
      }
    }
  }

  export interface MP4Box {
    write: (ds: DataStream) => void
  }

  interface MP4VideoData {
    width: number
    height: number
  }

  interface MP4VideoTrack extends MP4MediaTrack {
    video: MP4VideoData
  }

  interface MP4AudioData {
    sample_rate: number
    channel_count: number
    sample_size: number
  }

  interface MP4AudioTrack extends MP4MediaTrack {
    audio: MP4AudioData
  }

  type MP4Track = MP4VideoTrack | MP4AudioTrack

  export interface MP4Info {
    duration: number
    timescale: number
    fragment_duration: number
    isFragmented: boolean
    isProgressive: boolean
    hasIOD: boolean
    brands: string[]
    created: Date
    modified: Date
    tracks: MP4Track[]
    videoTracks: MP4VideoTrack[]
  }

  export type MP4ArrayBuffer = ArrayBuffer & { fileStart: number }

  interface MP4Box {
    write: (dataStream: DataStream) => void
  }

  const DataStream: {
    BIG_ENDIAN: unknown
    END_ENDIAN: unknown
    prototype: DataStream
    new(
      size?: number,
      byteOffset?: number,
      endianness?: DataStream.BIG_ENDIAN | DataStream.END_ENDIAN
    ): DataStream
  }

  interface DataStream {
    buffer: ArrayBuffer
    endianness: unknown
  }

  export interface VideoTrackOpts {
    timescale: number
    width: number
    height: number
    brands?: string[]
    avcDecoderConfigRecord: AllowSharedBufferSource | undefined | null
  }

  export interface AudioTrackOpts {
    timescale: number
    media_duration: number
    duration: number
    nb_samples: number
    samplerate: number
    channel_count: number
    samplesize: number
    hdlr: string
    name: string
    type: string
  }

  interface SampleOpts {
    duration: number
    dts?: number
    cts?: number
    is_sync: boolean
  }

  export interface VideoSampleDesc {
    compressorname: string
    frame_count: number
    height: number
    size: number
    start: number
    type: string
    width: number
    avcC?: MP4Box
  }

  export interface AudioSampleDesc {
    samplerate: number
    samplesize: number
    size: number
    start: number
    type: string
    channel_count: number
  }

  export interface MP4Sample {
    track_id: number
    description: VideoSampleDesc | AudioSampleDesc
    is_rap: boolean
    is_sync: boolean
    timescale: number
    dts: number
    cts: number
    duration: number
    size: number
    data: ArrayBuffer
  }

  export interface MP4File {
    boxes: MP4Box[]

    addTrack: (opts: VideoTrackOpts | AudioTrackOpts) => number
    addSample: (trackId: number, buf: ArrayBuffer, sample: SampleOpts) => void

    getTrackById: (id: number) => MP4Track
    setExtractionOptions: (id: number, user?: unknown, opts?: {
      nbSamples?: number
      rapAlignement?: boolean
    }) => void

    onMoovStart?: () => void
    onReady?: (info: MP4Info) => void
    onSamples: (id: number, user: unknown, samples: MP4Sample[]) => void
    onError?: (e: string) => void

    appendBuffer: (data: MP4ArrayBuffer) => number
    start: () => void
    stop: () => void
    write: (ds: DataStream) => void
    flush: () => void

  }

  export function createFile (): MP4File

  const DefExp: {
    MP4File: MP4File
    createFile: () => MP4File
    DataStream: typeof DataStream
  }

  export default DefExp
}