"use client";
import {useEffect,useId,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";import {X} from "lucide-react";
interface ModalProps{isOpen:boolean;onClose:()=>void;title?:string;children:ReactNode;bottomSheet?:boolean;wide?:boolean}
export default function Modal({isOpen,onClose,title="Thông tin chi tiết",children,bottomSheet=true,wide=false}:ModalProps){
 const ref=useRef<HTMLDialogElement>(null),id=useId();const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 useEffect(()=>{const dialog=ref.current;if(!mounted||!dialog)return;if(!isOpen){if(dialog.open)dialog.close();return;}const previous=document.body.style.overflow;document.body.style.overflow="hidden";if(!dialog.open)dialog.showModal();return()=>{if(dialog.open)dialog.close();document.body.style.overflow=previous;};},[isOpen,mounted]);
 if(!mounted)return null;
 return createPortal(<dialog ref={ref} className={`ui-dialog ${bottomSheet?"ui-sheet":""} ${wide?"ui-dialog-wide":""}`} aria-labelledby={id} onKeyDown={e=>{if(e.key!=="Tab"||e.ctrlKey||e.metaKey||e.altKey)return;const elements=[...e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length>0&&!el.closest("[hidden]"));const first=elements[0],last=elements[elements.length-1];if(!first){e.preventDefault();return;}if(e.shiftKey&&(document.activeElement===first||!e.currentTarget.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="ui-dialog-surface"><header className="ui-dialog-header"><h2 id={id}>{title}</h2><button type="button" className="ui-icon-button" aria-label="Đóng" onClick={onClose}><X size={22}/></button></header><div className="ui-dialog-body">{children}</div></div></dialog>,document.body);
}
