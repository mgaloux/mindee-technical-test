import { Button, Stack } from '@mui/material'
import Dropzone from 'react-dropzone'
import { AnnotationShape, AnnotationViewer, Stage } from 'react-mindee-js'

import AnnotationPlaceholder from './AnnotationPlaceholder'
import { useRef } from 'react'

type DocumentInterfaceProps = {
  document: File | null
  onClickUpload: (file: File) => void
  annotationShapes?: AnnotationShape[]
  setSelectedKey: (key: string | null) => void
  setAnnotationViewerStage: (stage: Stage) => void
}

export default function DocumentInterface({
  document,
  annotationShapes: shapes,
  onClickUpload,
  setSelectedKey,
  setAnnotationViewerStage,
}: DocumentInterfaceProps) {
  const isHovering = useRef(false); // Track if the cursor is actively hovering

  const onShapeMouseEnter = (shape: AnnotationShape) => {
    isHovering.current = true; // Set hovering state
    setSelectedKey(shape.id);
  };

  const onShapeMouseLeave = () => {
    isHovering.current = false; // Unset hovering state
    setTimeout(() => {
      if (!isHovering.current) {
        setSelectedKey(null); // Only reset if the user is not hovering back
      }
    }, 100); // Adjust delay as needed
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Dropzone onDrop={(files) => onClickUpload(files[0])} multiple={false}>
        {({ getRootProps, getInputProps, open }) => (
          <>
            <Stack sx={{ flexGrow: 1 }}>
              {document ? (
                <AnnotationViewer
                  data={{
                    image: URL.createObjectURL(document),
                    shapes: shapes || [],
                  }}
                  onShapeMouseLeave={onShapeMouseLeave}
                  onShapeMouseEnter={onShapeMouseEnter}
                  style={{ height: '100%', width: '100%', borderRadius: 4 }}
                  getStage={setAnnotationViewerStage}
                />
              ) : (
                <Stack
                  sx={{ position: 'relative', flexGrow: 1 }}
                  {...getRootProps()}
                >
                  <AnnotationPlaceholder />
                </Stack>
              )}

              <input {...getInputProps()} />
            </Stack>

            <Stack
              direction="row"
              columnGap={2}
              sx={{ marginTop: 2, justifyContent: 'center' }}
            >
              <Button
                variant="outlined"
                onClick={() => open()}
                sx={{ paddingInline: 2, textTransform: 'none' }}
              >
                Upload document
              </Button>
            </Stack>
          </>
        )}
      </Dropzone>
    </Stack>
  )
}
