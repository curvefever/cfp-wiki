'use client'
import type { ForwardedRef } from 'react'
import {
  MDXEditor,
  headingsPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  listsPlugin,
  linkDialogPlugin,
  linkPlugin,
  quotePlugin,
  tablePlugin,
  imagePlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  thematicBreakPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  InsertAdmonition,
  directivesPlugin,
  DialogButton,
  usePublisher,
  insertDirective$,
  DirectiveDescriptor,
  GenericDirectiveEditor,
  AdmonitionDirectiveDescriptor
} from '@mdxeditor/editor'
import "@mdxeditor/editor/style.css";
import "./editor.css";

// const YouTubeButton = () => {
//   const insertDirective = usePublisher(insertDirective$)
//   return (
//     <DialogButton
//       tooltipTitle="Insert Youtube video"
//       submitButtonTitle="Insert video"
//       dialogInputPlaceholder="Paste the youtube video URL"
//       buttonContent="YT"
//       onSubmit={(url) => {
//         const videoId = new URL(url).searchParams.get('v')
//         if (videoId) {
//           insertDirective({
//             name: 'youtube',
//             type: 'leafDirective',
//             attributes: { id: videoId },
//             children: []
//           } as LeafDirective)
//         } else {
//           alert('Invalid YouTube URL')
//         }
//       }}
//     />
//   )
// }

const YoutubeDirectiveDescriptor: DirectiveDescriptor = {
  name: 'youtube',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: [],
  hasChildren: true,
  Editor: GenericDirectiveEditor
}

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      className="dark-theme dark-editor" 
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        linkDialogPlugin(),
        linkPlugin(),
        quotePlugin(),
        imagePlugin(),
        tablePlugin(),
        markdownShortcutPlugin(),
        directivesPlugin( { directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        diffSourcePlugin({
          diffMarkdown: props.markdown,
          viewMode: "rich-text",
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles/>
                <CodeToggle />
                <BlockTypeSelect />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
                <ListsToggle />
                <InsertAdmonition />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}