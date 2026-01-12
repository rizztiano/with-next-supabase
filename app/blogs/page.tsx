'use client'

import { RichTextEditor } from '@/components/rich-text-editor'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

export default function Blog() {
   const [open, setOpen] = useState<boolean>(false)
   const [content, setContent] = useState<string>()

   const saveBlog = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      toast.info('created')
      setOpen(false)
   }

   return (
      <div className='flex-1 w-full flex flex-col gap-12'>
         <div className='flex'>
            <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                  <Button className='bg-green-600 hover:bg-green-700'>Create</Button>
               </DialogTrigger>
               <DialogContent
                  onInteractOutside={(e) => e.preventDefault()}
                  className='sm:max-w-150'
               >
                  <form className='gap-6 flex flex-col' onSubmit={saveBlog}>
                     <DialogHeader>
                        <DialogTitle>Create a blog</DialogTitle>
                        <DialogDescription>
                           Launch a blog and start sharing content in minutes.
                        </DialogDescription>
                     </DialogHeader>
                     <RichTextEditor
                        className='[&_.ProseMirror]:max-h-100 [&_.ProseMirror]:overflow-auto'
                        value={content}
                        onChange={setContent}
                     ></RichTextEditor>
                     <DialogFooter>
                        <DialogClose asChild>
                           <Button variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button type='submit'>Create</Button>
                     </DialogFooter>
                  </form>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   )
}
