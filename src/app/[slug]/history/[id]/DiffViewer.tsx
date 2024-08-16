'use client'
import ReactDiffViewer from 'react-diff-viewer-continued';

interface IProps {
    oldValue: string;
    newValue: string;
}

export default function DiffViewer({ oldValue, newValue }: IProps) {
  return (
    <ReactDiffViewer oldValue={oldValue} newValue={newValue} splitView={true} useDarkTheme={true} />
  )
}
