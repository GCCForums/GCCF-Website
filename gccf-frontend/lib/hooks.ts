"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsApi, eventsApi, galleryApi, membershipsApi, homepageApi, queryKeys } from "@/lib/api";
import { CreateNewsDto, UpdateNewsDto } from "@/types/news";
import { CreateEventDto, UpdateEventDto } from "@/types/events";
import { CreateGalleryDto, UpdateGalleryDto } from "@/types/gallery";
import { CreateMembershipDto, UpdateMembershipDto } from "@/types/membership";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

export function useNews() {
  return useQuery({
    queryKey: queryKeys.news.lists(),
    queryFn: newsApi.getAll,
  });
}

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.news.detail(slug),
    queryFn: () => newsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateNewsDto) => newsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.lists() });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsDto }) => 
      newsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.news.detail(variables.id) });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.lists() });
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: queryKeys.events.lists(),
    queryFn: eventsApi.getAll,
  });
}

export function useCompletedEvents() {
  return useQuery({
    queryKey: [...queryKeys.events.all, 'completed'] as const,
    queryFn: eventsApi.getCompleted,
  });
}

export function useEventBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(slug),
    queryFn: () => eventsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEventDto) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) => 
      eventsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
  });
}

export function useGallery() {
  return useQuery({
    queryKey: queryKeys.gallery.lists(),
    queryFn: galleryApi.getAll,
  });
}

export function useVisibleGallery() {
  return useQuery({
    queryKey: [...queryKeys.gallery.all, 'visible'] as const,
    queryFn: galleryApi.getVisible,
  });
}

export function useGalleryById(id: string) {
  return useQuery({
    queryKey: queryKeys.gallery.detail(id),
    queryFn: () => galleryApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateGallery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGalleryDto) => galleryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
    },
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGalleryDto }) => 
      galleryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.detail(variables.id) });
    },
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.lists() });
    },
  });
}

export function useMemberships() {
  return useQuery({
    queryKey: queryKeys.memberships.lists(),
    queryFn: membershipsApi.getAll,
  });
}

export function usePendingMemberships() {
  return useQuery({
    queryKey: queryKeys.memberships.pending(),
    queryFn: membershipsApi.getPending,
  });
}

export function useApprovedMemberships() {
  return useQuery({
    queryKey: queryKeys.memberships.approved(),
    queryFn: membershipsApi.getApproved,
  });
}

export function useMembershipById(id: string) {
  return useQuery({
    queryKey: queryKeys.memberships.detail(id),
    queryFn: () => membershipsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMembership() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMembershipDto) => membershipsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.lists() });
    },
  });
}

export function useUpdateMembership() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMembershipDto }) => 
      membershipsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.pending() });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.approved() });
    },
  });
}

export function useDeleteMembership() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => membershipsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.lists() });
    },
  });
}

export function useHomepageContent() {
  return useQuery({
    queryKey: ["homepage", "content"],
    queryFn: () => homepageApi.get(),
    placeholderData: DEFAULT_HOMEPAGE_CONTENT,
    staleTime: 0,
    refetchOnMount: true,
  });
}