import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Collapsible, CollapsibleTrigger,CollapsibleContent } from "@/components/ui/collapsible";

export const TreeView = ({ data, value, onSelect }) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full border-r">
        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

const Tree = ({ item, selectedValue, onSelect, parentPath }) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // FILE NODE
  if (!items.length) {
    const isSelected = selectedValue === currentPath;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        onClick={() => onSelect?.(currentPath)}
        className={`
          flex items-center gap-2 rounded-md px-2 py-1.5
          hover:bg-muted transition-colors
          data-[active=true]:bg-primary/10
          data-[active=true]:text-primary
        `}
      >
        <FileIcon className="size-4 text-muted-foreground" />
        <span className="truncate text-sm">{name}</span>
      </SidebarMenuButton>
    );
  }

  // FOLDER NODE
return (
  <SidebarMenuItem>
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
          <ChevronRightIcon
            className="
              size-4 shrink-0
              transition-transform duration-200
              group-data-[state=open]/collapsible:rotate-90
            "
          />

          <FolderIcon className="size-4 text-yellow-500" />

          <span className="truncate text-sm font-medium">{name}</span>
        </SidebarMenuButton>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub className="ml-4 border-l pl-2">
          {items.map((child, index) => (
            <Tree
              key={index}
              item={child}
              selectedValue={selectedValue}
              onSelect={onSelect}
              parentPath={currentPath}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  </SidebarMenuItem>
);
};